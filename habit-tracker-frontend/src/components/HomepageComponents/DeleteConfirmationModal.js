import React from 'react';
import styled from 'styled-components';

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
  background: #454444;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  cursor: default;
  transition: background-color 0.3s ease, filter 0.3s ease;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #fff;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const CancelButton = styled.button`
  background: #fdda87;
  color: #454444;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease, filter 0.3s ease;
  &:hover {
    filter: brightness(0.8);
    cursor: pointer;
  }
  
`;

const ConfirmButton = styled.button`
  background: #72d7f0;
  font-size: 1rem;
  color: #454444;
  font-weight: 600;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  transition: background-color 0.3s ease, filter 0.3s ease;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
    cursor: pointer;
  }
`;

const DeleteConfirmModal = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <ModalBackground onClick={onCancel}>
      <ModalContainer className='fade-in' onClick={(e) => e.stopPropagation()}>
        <Title>Are you sure you want to delete this habit?</Title>
        <Message>All your progress <strong>will be deleted</strong>. But if you think this habit has become natural for you to do without our help, feel free to make space on streak2habit for brand new habits to form!</Message>
        <ButtonContainer>
          <CancelButton onClick={onCancel}>Let me think about it.</CancelButton>
          <ConfirmButton onClick={onConfirm}>I'm sure!</ConfirmButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackground>
  );
};

export default DeleteConfirmModal;
