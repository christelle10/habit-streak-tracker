import React, { useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import HabitForm from './HabitModal';
import { UserContext } from '/Users/christelleridad/habit-streak-tracker/habit-tracker-frontend/src/components/UserContext.js';
import UserProgressModal from './YourProgressModal';

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 30%;
  margin: 2rem auto;
  background-color: #1f1e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50px;
  box-shadow: 0;
  box-sizing: border-box;
  overflow: hidden;
  @media (max-width: 600px) {
    width: 80%;
    padding: 0.75rem;
    flex-direction: row;
    align-items: center;
    max-width: 600px;
  }
`;

const AddHabitButton = styled.button`
  background-color: #72d7f0;
  color: #252329;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  &:hover {
    background-color: #56b0d7;
    transition: 0.3s ease-in-out;
  }

  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 1rem;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SvgButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg, img {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    opacity: 0.8;
    transition: opacity 0.3s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
  &:hover {
    color: gray;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  color: white;

  &:hover {
    color: #72d7f0;
  }
`;

const BottomNavBar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalProgress, setShowModalProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [acceptedHabits, setAcceptedHabits] = useState([]);

  const { username, habits, setHabits }  = useContext(UserContext);
  const { currentDayHabitIds, setCurrentDayHabitIds} = useContext(UserContext);

  console.log("BottomNav username:", username);

  const handleAddHabitClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  
  const closeModalProgress = () => setShowModalProgress(false);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const userId = username; // Use the logged-in user ID
      const response = await fetch(`http://localhost:5001/api/habits/user/${userId}`); // Adjust API route as needed

      if (!response.ok) {
        throw new Error(`Failed to fetch habits: ${response.statusText}`);
      }

      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleProgressClick = () => {
    fetchHabits(); // Fetch habits when progress button is clicked
    setShowModalProgress(true); // Show the progress modal
  };
  const handleFormSubmit = async (habitData) => {
    if (habitData.frequency === 'daily') {
      delete habitData.daysOfWeek; // Remove daysOfWeek if frequency is daily
    }
    
    console.log('Habit data to send:', habitData);

    try {
      const response = await fetch('http://localhost:5001/api/habits/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Habit added successfully:', result);

        //**When habit is successfully added to the backend, update the CurrentDayHabitIds in the context**
        
        //checking if habit should be part of today
        const today = new Date();
        const isToday = habitData.frequency === 'daily' || 
                        (habitData.frequency === 'weekly' && 
                          habitData.daysOfWeek.includes(today.toLocaleString('en-US', { weekday: 'long'}))
                        ); 
        if (isToday) {
          setCurrentDayHabitIds((prev) => [...prev, result._id]);
        }
      } else {
        // Log response status and text to understand the failure
        const errorDetails = await response.text();
        console.error(`Failed to add habit. Status: ${response.status}, Details: ${errorDetails}`);
      }
    } catch (error) {
        // Catch and log any unexpected errors during the fetch request
      
        console.error('Error during request:', error.message);
    }

    closeModal();
  };

  return (
    <BottomNav className='fade-in'>
      {username ? (
        <>
          <NavItem>
            <AddHabitButton onClick={handleAddHabitClick}>+ New Habit</AddHabitButton>
            {showModal && <HabitForm closeModal={closeModal} onSubmit={handleFormSubmit} username={username} show={showModal} />}
          </NavItem>
          <NavItem>
            <SvgButton onClick={handleProgressClick}><img src="/icons/bar.svg" alt="Progress Icon" /></SvgButton>
            {showModalProgress && <UserProgressModal closeModal={closeModalProgress} show={showModalProgress} habits={habits} />} {/* Progress Modal */}
          </NavItem>
          <NavItem>
              <a href="https://jamesclear.com/habits" target="_blank" rel="noopener noreferrer">
                <SvgButton>
                  <img src="/icons/question.svg" alt="Learn More Icon" />
                </SvgButton>
              </a>
          </NavItem>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </BottomNav>
  );
  
};

export default BottomNavBar;
