import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import DeleteConfirmModal from './DeleteConfirmationModal';
import { UserContext } from '../UserContext';
import DeleteSuccessModal from './DeletionSuccess';

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #dbf5ff;
  text-transform: uppercase;
  margin-top: -1rem;
`;

const SubTitle = styled.h2`
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
  text-transform: capitalize;
  margin-top: -0.5rem;
`;



const HeaderContainer = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: left; 
  justify-content: left;
  width: 100%; 
  padding: 1rem; 
  margin-top: 1rem;
  box-sizing: border-box; 
  @media (max-width: 768px) {
      padding: 0.5rem; 
      margin-top: 1rem;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background-color 0.3s ease, filter 0.3s ease;
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #454444;
  padding: 1rem;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  cursor: default;
  transition: background-color 0.3s ease, filter 0.3s ease;
`;


const CloseButton = styled.button`
  background: none;
  color: #fff;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  &:hover {
    color: #cecccc;
    cursor: pointer;
  }
`;

const GridWrapper = styled.div`
  display: flex;
  align-items: center; /* Align vertically */
  justify-content: center; /* Optional: Center horizontally */
  gap: 10px; /* Space between arrows and grid */
  position: relative; /* If you need precise positioning */
  
`;

const NavigationArrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* Allow clicks to pass through transparent areas */

  button {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    pointer-events: auto; /* Re-enables clicks on the button itself */
    opacity: 0.8;
    transition: color 0.3s, opacity 0.3s;

    &:hover {
      color: gray;
      opacity: 1;
    }

    &:disabled {
      color: lightgray;
      cursor: not-allowed;
    }
  }

  @media (max-width: 768px) {
    button {
      font-size: 1.5rem;
    }
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 5px 0;
`;

const GridBox = styled.div`
  width: 50px;
  font-size: 1rem;
  color: #fff;
  height: 50px;
  background: ${(props) => (props.checked ? '#fff' : 'transparent')};
  border: 0.5px solid white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Checkmark = styled.span`
  font-size: 24px;
  background-color: #ffff;
`;



const DeleteButton = styled.button`
  background: #fdda87;
  color: #252329;
  font-size: 1rem;
  font-weight: 600;
  border: 0px;
  padding: 0.75rem 1.5rem;
  width: 50%;
  margin: 1.5rem 0;
  border-radius: 20px;
  transition: background-color 0.3s ease, filter 0.3s ease;
  &:hover {
    filter: brightness(0.8);
    cursor: pointer;
`;

const StreaksModal = ({ isVisible, closeModal, backToProgress, habit }) => {
  const { setCurrentDayHabitIds } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const { habits, setHabits } = useContext(UserContext);

  const dayAbbreviations = {
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "TH",
    Friday: "F",
    Saturday: "SA",
    Sunday: "SU",
};

  const MAX_STREAKS_PER_PAGE = 25;
  const totalStreaks = habit.streak; // Replace with your habit streak data
  const totalPages = Math.max(1, Math.ceil(totalStreaks / MAX_STREAKS_PER_PAGE));

  const getStreaksForPage = () => {
    const start = currentPage * MAX_STREAKS_PER_PAGE;
    const end = Math.min(start + MAX_STREAKS_PER_PAGE, totalStreaks);
  
    // Create an array with placeholders for the grid
    return Array.from({ length: MAX_STREAKS_PER_PAGE }, (_, i) =>
      start + i < totalStreaks
    );
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const streaks = getStreaksForPage();
  const handleDeleteClick = () => {
    setIsDeleteConfirmationVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationVisible(false);
  };

  const handleConfirmDelete = async () => {
    try {
      // Make DELETE request to remove habit
      const response = await fetch(`http://localhost:5001/api/habits/delete/${habit._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Handle success
        setIsDeleteConfirmationVisible(false); // Close delete confirmation modal
        setCurrentDayHabitIds((prevIds) => prevIds.filter((id) => id !== habit._id));
        // Remove the habit locally
        setHabits(habits.filter((h) => h._id !== habit._id));
        setIsSuccessModalVisible(true);
      } else {
        console.error(data.message); // Handle error
      }
    } catch (error) {
      console.error('Error deleting habit:', error); // Handle any errors
    }
  };
  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
    backToProgress(); // Navigate to progress modal
  };

  if (!isVisible) return null;
  let numberCounter = 1;

  return (
    <ModalBackground onClick={closeModal}>
      <ModalContainer className='fade-in' onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={closeModal}>x</CloseButton>
        <HeaderContainer>
          <Title>{habit.name}</Title>
          <SubTitle>
            <span style = {{ color: '#72d7f0' }}>{habit.frequency}</span>{habit.frequency === 'daily' && (" |")}
            {habit.daysOfWeek && habit.daysOfWeek.length > 0 && (
                <span>
                    {" "}({habit.daysOfWeek.map((day, index) => (
                        <span key={index}>
                            {dayAbbreviations[day]}
                            {index < habit.daysOfWeek.length - 1 && ", "}
                        </span>
                    ))}) |
                </span>
            )}{" "}
            {"Every "}{(() => {
                  const [hours, minutes] = habit.timeOfDay.split(":").map(Number); 
                  const isPM = hours >= 12; 
                  const standardHours = hours % 12 || 12; 
                  const suffix = isPM ? "PM" : "AM"; 
                  return `${standardHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
              })()}
          </SubTitle>
        </HeaderContainer>
        <GridWrapper>
        {/* Left arrow */}
        <NavigationArrows>
          <button onClick={handlePrev} disabled={currentPage === 0}>
            &#60;
          </button>
        </NavigationArrows>

        {/* Grid */}
        <GridContainer>
          {streaks.map((isChecked, idx) => (
            <GridBox key={idx} checked={isChecked}>
              {isChecked ? (<Checkmark>✔</Checkmark>) : (numberCounter++)}
            </GridBox>
          ))}
        </GridContainer>

        {/* Right arrow */}
        <NavigationArrows>
          <button onClick={handleNext} disabled={currentPage >= totalPages - 1}>
            &#62;
          </button>
        </NavigationArrows>
      </GridWrapper>
        <DeleteButton onClick={handleDeleteClick}>DELETE THIS HABIT</DeleteButton>
      </ModalContainer>
      {isDeleteConfirmationVisible && (
        <DeleteConfirmModal 
          isVisible={isDeleteConfirmationVisible} 
          onConfirm={handleConfirmDelete} 
          onCancel={handleCancelDelete} 
        />
      )}

      {isSuccessModalVisible && (
                <DeleteSuccessModal
                    isVisible={isSuccessModalVisible}
                    message="Habit successfully deleted!"
                    onButtonClick={closeModal}
                />
        )}
    </ModalBackground>
  );
};

export default StreaksModal;
