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
  transition: background-color 0.3s ease, filter 0.3s ease;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #dbf5ff;
  text-align: center;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  background: #fdda87;
  color: #252329;
  font-size: 1rem;
  font-weight: 600;
  border: 0px;
  padding: 0.75rem;
  width: 50%;
  margin-top: -0.5rem;
  border-radius: 20px;
  transition: background-color 0.3s ease, filter 0.3s ease;
  &:hover {
    filter: brightness(1.1);
}
`

const DeleteSuccessModal = ({ isVisible, message, onButtonClick }) => {
  if (!isVisible) return null;

  return (
    <ModalBackground>
      <ModalContainer className='fade-in'>
        <Message>{message}</Message>
        <ActionButton onClick={onButtonClick}>Go Back to Your Progress</ActionButton>
      </ModalContainer>
    </ModalBackground>
  );
};

export default DeleteSuccessModal;
