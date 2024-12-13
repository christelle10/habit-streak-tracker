import React, { useState } from 'react';
import styled from 'styled-components';
import CustomDropdown from "./CustomDropdown";
import CustomMultiDropdown from './MultiSelectDropdown';

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #dbf5ff;
`
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
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #454444;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  transform: translateY(30px); 
  opacity: 0; 
  transition: transform 0.5s ease-out, opacity 0.5s ease-out; /* Smooth transition */

  ${({ show }) => show && `
    transform: translateY(0); /* Move to normal position */
    opacity: 1; /* Fade in */
  `}

  ${({ fadeOut }) => fadeOut && `
    animation: fadeOut 0.3s ease-out forwards;
  `}

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const FormContainer = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  width: 100%; 
  padding: 1rem; 
  box-sizing: border-box; 
  @media (max-width: 768px) {
      padding: 0.5rem; 
  }
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column; 
    align-items: flex-start; 
    margin-bottom: 1rem; 
    width: 100%; 
`;

const StyledLabel = styled.label`
    font-size: 1rem; 
    color: #ffffff; 
    margin-bottom: 0.5rem; 
    font-weight: bold;
`;
const StackedContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0px; /* Space between items */
  @media (max-width: 768px) {
    flex-direction: column; /* Stacks the items vertically on smaller screens */
    align-items: center; /* Center-align the items when stacked */
  }
`;

const StyledInput = styled.input`
    font-size: 1rem; 
    padding: 0.5rem; 
    border: 0px solid #ccc;
    border-radius: 10px; 
    width: ${(props) => props.width || "100%"};
    box-sizing: border-box; 
    background-color: #959595;
    color: #ffffff;

    &:focus {
        outline: none; 
        border: 1px solid #ccc;
    }
`;

const CustomTimeInput = styled.input.attrs({ type: 'time' })`
  width: ${(props) => props.width || '100%'};
  padding: 0.5rem;
  font-size: 1rem;
  border: 0px solid #ccc;
  border-radius: 10px;
  background-color: #959595;
  color: #ffffff;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border: 1px solid #ccc;
    border: 1px solid #ccc;
   
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    background-color: #959595;
  }
`;

const ActionButton = styled.button`
  background: #fdda87;
  color: #252329;
  font-size: 1rem;
  font-weight: 600;
  border: 0px;
  padding: 0.75rem 1.5rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 20px;
  &:hover {
    filter: brightness(1.1);
}
`

const CloseButton = styled.button`
  background: none;
  color: #ffff;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  &:hover {
  color: #cecccc}
`;

const HabitForm = ({ closeModal, onSubmit, username, show }) => {
  const [frequency, setFrequency] = useState("daily");
  const [selectedDays, setSelectedDays] = useState([]);
  const [fadeOut, setFadeOut] = useState(false); // New state for fade-out

  const handleClose = () => {
    setFadeOut(true); // Trigger fade-out
    setTimeout(() => closeModal(), 500); // Close the modal after the fade-out animation
  };
  
  
  console.log("HabitForm username:", username)

  

  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    //const formData = new FormData(e.target);

    //error handling for non-existent user
    if (!username) {
        console.log('User is not logged in');
        return;
    }
    // Collect habit data
    const habitData = {
        username: username,
        name: e.target.name.value,
        frequency,
        daysOfWeek: frequency === "weekly" ? selectedDays : [],
        timeOfDay: e.target.time.value,
        location: e.target.location.value,
        streak: 0,

    };
   
  
    

    console.log('Sending habit data:', habitData); 

    // Pass the habit data to the onSubmit handler from BottomNavBar
    onSubmit(habitData);

    // Trigger the fade-out animation on submit as well
    setFadeOut(true);
    setTimeout(() => closeModal(), 500); // Close the modal after the fade-out animation
    
  };

  return (
    <ModalBackground onClick={handleClose}>
      <ModalContainer className='fade-in' show={show} fadeOut={fadeOut} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>x</CloseButton>
        <Title>Add a New Habit</Title>
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <StyledLabel>Habit Name:</StyledLabel>
              <StyledInput type="text" name="name" required />
            </FormGroup>
            
            
            <StackedContainer>
              <FormGroup>
              <StyledLabel>Frequency:</StyledLabel>
                  <CustomDropdown
                    name="frequency"
                    required
                    options={["Daily", "Weekly"]}
                    selectedOption={frequency}
                    setSelectedOption={setFrequency}
                  />
              </FormGroup>
              {frequency === "weekly" && (
                <FormGroup>
                  <StyledLabel>Select Days:</StyledLabel>
                  <CustomMultiDropdown
                    options={[
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ]}
                    selectedOptions={selectedDays}
                    setSelectedOptions={setSelectedDays}
                  />
                  </FormGroup>
              )}
            </StackedContainer>
            
            <StackedContainer>
              <FormGroup>
                <StyledLabel>Time of Day:</StyledLabel>
                <CustomTimeInput type="time" name="time" required width="80%" />
              </FormGroup>

              <FormGroup>
              <StyledLabel>Location: </StyledLabel>
              <StyledInput type="text" name="location" />
              </FormGroup>
            </StackedContainer>

            <ActionButton type="submit">Add Habit</ActionButton>
          </form>
        </FormContainer>
      </ModalContainer>
    </ModalBackground>
  );
};

export default HabitForm;
