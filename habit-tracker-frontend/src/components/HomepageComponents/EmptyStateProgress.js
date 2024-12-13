import React, { useContext, useState, useCallback } from 'react';
import styled from "styled-components";
import HabitForm from './HabitModal';
import { UserContext } from '/Users/christelleridad/habit-streak-tracker/habit-tracker-frontend/src/components/UserContext.js';


const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
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

const Message = styled.p`
  color: rgba(255, 255, 255, 0.56);
  font-size: 1rem;
`

const EmptyStateProgress = () => {
    const [showModal, setShowModal] = useState(false);
    
    const closeModal = () => setShowModal(false);
    
    
    

  return (
    <EmptyStateContainer>
        <Message>
        You currently don't have any habits to form today yet.
        <br />
        Create a new habit to get started.
      </Message>
      
      
    </EmptyStateContainer>
  );
};

export default EmptyStateProgress;
