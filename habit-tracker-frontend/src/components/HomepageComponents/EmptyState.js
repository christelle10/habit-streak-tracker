import React, { useContext, useState, useCallback } from 'react';
import styled from "styled-components";
import HabitForm from './HabitModal';
import { UserContext } from '/Users/christelleridad/habit-streak-tracker/habit-tracker-frontend/src/components/UserContext.js';

const BASE_URL = "https://habit-tracker-backend-l8el.onrender.com/api";
const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
   
`;

const StartButton = styled.div`
  width: 100%;  
  height: 100%; 
  min-width: 200px;
  min-height: 200px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }

  @media (min-width: 360px) {
   
    width: 250px;  
    height: 250px; 
    
  }
  @media (min-width: 375px) {
   
    width: 250px;  
    height: 250px; 
    
  }

  @media (min-width: 414px) {
 
    width: 250px;  
    height: 250px; 
  }

  
`;

const HexagonButtonText = styled.p`
  color: #252329;
  font-weight: 600;
  font-size: 2rem;
  text-align: center;
  margin: 0;
  position: absolute; /* Position text inside the hexagon */
  line-height: 1.2;

  @media (min-width: 375px) {
    font-size: 1.5rem;
    
  }
  @media (min-width: 480px) {
    font-size: 1.8rem;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Message = styled.p`
  color: rgba(255, 255, 255, 0.56);
  font-size: 1rem;

  @media (min-width: 375px) {
    font-size: 0.8rem;
    padding: 1rem;
    
  }
  @media (min-width: 414px) {
     font-size: 1rem;
     padding: 1rem;
     margin-top: 1rem;
  }
  
`

const EmptyState = () => {
    const [showModal, setShowModal] = useState(false);
    const handleAddHabitClick = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const { username, currentDayHabitIds, setCurrentDayHabitIds} = useContext(UserContext);
    
    const handleFormSubmit = async (habitData) => {
        if (habitData.frequency === 'daily') {
          delete habitData.daysOfWeek; // Remove daysOfWeek if frequency is daily
        }
        
        console.log('Habit data to send:', habitData);
    
        try {
          const response = await fetch(`${BASE_URL}/habits/add`, {
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
    <EmptyStateContainer>
      <StartButton onClick={handleAddHabitClick}>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 346.41016151377545 400"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            fill="#72d7f0"
            d="M160.21469970012114 7.499999999999999Q173.20508075688772 0 186.1954618136543 7.499999999999999L333.41978045700887 92.5Q346.41016151377545 100 346.41016151377545 115L346.41016151377545 285Q346.41016151377545 300 333.41978045700887 307.5L186.1954618136543 392.5Q173.20508075688772 400 160.21469970012114 392.5L12.99038105676658 307.5Q0 300 0 285L0 115Q0 100 12.99038105676658 92.5Z"
          />
        </svg>
        <HexagonButtonText> 
            <img src='/icons/plus.svg' alt="Plus" width="30" height="30" style={{ marginBottom: '8px' }} />
            <br/>START<br/> NEW</HexagonButtonText>
      </StartButton>
      {showModal && <HabitForm closeModal={closeModal} onSubmit={handleFormSubmit} username={username} show={showModal} />}
      <Message>
        You currently don't have any habits to form today yet.
        <br />
        Create a new habit to get started.
      </Message>
    </EmptyStateContainer>
  );
};

export default EmptyState;
