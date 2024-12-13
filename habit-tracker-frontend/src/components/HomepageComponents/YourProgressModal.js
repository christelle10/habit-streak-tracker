import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import StreaksModal from './StreaksModal';
import { UserContext } from '../UserContext';
import EmptyStateProgress from './EmptyStateProgress';

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #dbf5ff;
`;

const SubTitle = styled.h2`
  font-size: 1rem;
  font-weight: 400;
  color: #dbf5ff;
`;


const HeaderContainer = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  width: 100%; 
  padding: 1rem; 
  margin-top: 1rem;
  box-sizing: border-box; 
  @media (max-width: 768px) {
      padding: 0.5rem; 
      margin-top: 1rem;
  }
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
  padding: 1rem;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  cursor: default;
`;


const HabitContainer = styled.div`
  display: flex;
  height: auto;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  background: rgb(216,234,243);
  background: linear-gradient(100deg, rgba(216,234,243,1) 9%, rgba(200,221,231,1) 24%, rgba(188,224,240,1) 41%, rgba(165,229,255,1) 63%, rgba(145,217,247,1) 92%);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  padding: 1rem;
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    min-width: 300px;
  }
`;

const SubInfo = styled.h2`
    font-size: 0.8rem;
    font-weight: 400; 
    margin-top: -0.5rem;
    font-style: italic;
    @media (max-width: 768px) {
        font-size: 0.6rem;
    }
    &:hover {
    color: #454444;
    cursor: pointer;
  }
    
`

const TitleInfo = styled.h2`
    font-size: 1.5rem;
    font-weight: 600; 
    @media (max-width: 768px) {
        font-size: 1.3rem;
    }
`

const StreakInfo = styled.h2`
    font-size: 0.8rem;
    font-weight: 600; 
    margin-top: -0.5rem;
    @media (max-width: 768px) {
        font-size: 0.6rem;
    }
    &:hover {
    color: #454444;
  }
    
`
const HabitTitleContainer = styled.div `
    display: flex;
    flex: 2;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 50%;
    background-color: transparent;
    padding-left: 1rem;
    color: #252329;
    
    
`

const StreakContainer = styled.div `
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    background-color: transparent;
    padding-left: 1rem;
    img {
        width: 45px;
        height: 45px;
    }
    @media (max-width: 768px) {
        img {
            width: 35px;
            height: 35px;
        }
    }

`

const CloseButton = styled.button`
  background: none;
  color: #ffff;
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

const HabitsContainerWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  margin-top:-1rem;
  @media (max-width: 768px) {
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  }
`;



const NavigationArrows = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -2rem;
  pointer-events: none;
  button {
    background: none;
    border: none;
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    pointer-events: auto;
    opacity: 0.8;
    transition: color 0.3s, opacity 0.3s;

    &:hover {
      color: gray;
      opacity: 1;
      cursor: pointer;
    }

    &:disabled {
      color: lightgray;
      cursor: not-allowed;
    }
  }
  @media (max-width: 768px) {
    button {
      font-size: 2rem;
      margin: auto -0.5rem;
    }
  }

  @media (max-width: 480px) {
    button {
      font-size: 1.5rem;
      margin: auto -0.1rem;
    }
  }
`;

const EmptyStateMessage = styled.p`
  color: rgba(255, 255, 255, 0.56);
  font-size: 1rem;
  margin-top: 2rem;  
`

const UserProgressModal = ({ closeModal, show }) => {
  const habitsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleHabits, setVisibleHabits] = useState([]);
  const [isStreaksModalVisible, setStreaksModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const { habits, setHabits } = useContext(UserContext);

  const handleBackToProgress = () => {
    // Logic to navigate to progress view
    closeModal();
  };

  const handleStreaksModalOpen = (habit) => {
    setSelectedHabit(habit);
    setStreaksModalVisible(true); // Open StreaksModal
  };

  const handleStreaksModalClose = () => {
    setSelectedHabit(null);
    setStreaksModalVisible(false); // Close StreaksModal
  };

  useEffect(() => {
    const startIndex = currentPage * habitsPerPage;
    const currentHabits = habits.slice(startIndex, startIndex + habitsPerPage);
    setVisibleHabits(currentHabits);
  }, [habits, currentPage]);

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if ((currentPage + 1) * habitsPerPage < habits.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <>
      {show && !isStreaksModalVisible && (
        <ModalBackground onClick={closeModal}>
          <ModalContainer className='fade-in' onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>x</CloseButton>
            <HeaderContainer>
              <Title>YOUR PROGRESS</Title>
              <SubTitle>WITH ALL YOUR HABITS</SubTitle>
            </HeaderContainer>
            <HabitsContainerWrapper>
              {visibleHabits.length > 0 &&
                  ( <NavigationArrows>
                    <button onClick={handlePrev} disabled={currentPage === 0}>
                      &#60;
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={(currentPage + 1) * habitsPerPage >= habits.length}
                    >
                      &#62;
                    </button>
                  </NavigationArrows> )
                  
              }
              

              {visibleHabits.length > 0 ? (
                visibleHabits.map((habit) => (
                  <HabitContainer key={habit._id} className='slide-in'>
                    <HabitTitleContainer>
                      <TitleInfo>{habit.name}</TitleInfo>
                      <SubInfo onClick={() => handleStreaksModalOpen(habit)}>
                        <strong>{habit.frequency} </strong>progress →
                      </SubInfo>
                    </HabitTitleContainer>

                    <StreakContainer>
                      <img src="/icons/fire.svg" alt="clock-Illustration" />
                      <SubInfo
                        style={{
                          fontSize: '0.7rem',
                          color: '#ef5922',
                          fontWeight: '600',
                          fontStyle: 'normal',
                          marginTop: '0.2rem',
                        }}
                      >
                        {habit.streak}
                      </SubInfo>
                    </StreakContainer>
                  </HabitContainer>
                ))
              ) : (
                <EmptyStateProgress/>
              )}
            </HabitsContainerWrapper>
          </ModalContainer>
        </ModalBackground>
      )}
      {selectedHabit && (
        <StreaksModal
          isVisible={Boolean(selectedHabit)}
          closeModal={handleStreaksModalClose}
          habit={selectedHabit}
          backToProgress={handleBackToProgress}
        />
      )}
    </>
  );
};

export default UserProgressModal;