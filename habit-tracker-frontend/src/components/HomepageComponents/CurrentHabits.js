import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from '../UserContext';
import { fetchHabitDetailsBatch } from '../../services/HabitDetails';
import EmptyState from './EmptyState';
import { motion } from 'framer-motion';

const BASE_URL = "https://habit-tracker-backend-l8el.onrender.com/api";
const SubInfo = styled.h2`
    font-size: 0.7rem;
    font-weight: 400; 
    margin-top: 0.2rem;
    @media (max-width: 768px) {
        font-size: 0.6rem;
    }

    
`
const TitleInfo = styled.h2`
    font-size: 1.5rem;
    font-weight: 600; 
    @media (max-width: 768px) {
        font-size: 1.3rem;
    }
`


const ContentContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0 5rem;
    justify-content: center;
    /* Responsive stacking for mobile screens */
    @media (max-width: 768px) {
        flex-direction: column;
        padding: 0rem;
        padding-bottom: 6rem;
        align-items: center;
        gap: 1rem;

    }
    
`;

// Styled component for the graphic section
const GraphicContainer = styled.div`
    flex: 1;
    height: auto;
    background-color: transparent;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -8rem;
    svg, img {
        width: 100%;
        height: auto;
        max-width: 400px; /* Limit max width for better scaling on larger screens */
    }

    @media (max-width: 768px) {
        margin-top: 0rem;
        padding: 0; 
        svg, img {
            width: 90%;
            height: auto;
            max-width: 350px; /* Limit max width for better scaling on larger screens */
        }
    }
`;

// Styled component for the habit list section
const HabitsContainerWrapper = styled.div`
    position: relative; /* Enables positioning the arrows relative to this container */
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: transparent;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem 2rem;
    margin-bottom: 4rem;
    @media (max-width: 768px) {
        padding: 0 1rem; 
        margin-bottom: 1rem;
    }
`;


const HabitContainer = styled.div `
    display: flex;
    height: auto;
    width: 100%;
    max-width: 600px;
    justify-content: space-between;
    align-items: center;
    background: rgb(216,234,243);
    background: linear-gradient(100deg, rgba(216,234,243,1) 9%, rgba(200,221,231,1) 24%, rgba(188,224,240,1) 41%, rgba(165,229,255,1) 63%, rgba(145,217,247,1) 92%);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin: 1rem;
    padding: 1rem;
    margin-left: -1rem;
    @media (max-width: 768px) {
        padding: 0.5rem 1rem;
        min-width: 300px;
    }
`;
const VerticalDivider = styled.div`
    width: 1px;
    height: 50px;
    background-color: #252329;
    opacity: 0.25;
    
`;

const TimeContainer = styled.div `
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50%;
    background-color: transparent;
    padding-left: 1rem;
    padding-top: 1rem;
    img {
        width: 40px;
        height: 40px;
    }
    @media (max-width: 768px) {
        img {
            width: 30px;
            height: 30px;
        }
    }

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
    padding-top: 1rem;
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
const HabitTitleContainer = styled.div `
    display: flex;
    flex: 2;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 50%;
    background-color: transparent;
    padding-left: 1rem;
    
    
`


const NavigationArrows = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -2rem;
    pointer-events: none; /* Allow clicks to pass through transparent areas */

    button {
        background: none;
        border: none;
        color: white;
        font-size: 2.5rem;
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
            font-size: 2rem; 
            margin: auto -0.5rem
        }

    @media (max-width: 480px) {
        button {
            font-size: 1.5rem; 
            margin: auto -0.1rem
        }
    }
`;

const CustomCheckBox = styled.div`
.cbx {
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }

  .cbx span {
    display: inline-block;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }

  .cbx span:first-child {
    position: relative;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transform: scale(0.8);
    vertical-align: middle;
    border: 1px solid #b9b8c3;
    transition: all 0.2s ease;
  }

  .cbx span:first-child svg {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 6px;
    fill: none;
    stroke: white;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }

  .cbx span:first-child:before {
    content: "";
    width: 100%;
    height: 100%;
    background: #506eec;
    display: block;
    transform: scale(0);
    opacity: 1;
    border-radius: 50%;
    transition-delay: 0.2s;
  }

  .cbx span:last-child {
    margin-left: 8px;
  }

  .cbx span:last-child:after {
    content: "";
    position: absolute;
    top: 8px;
    left: 0;
    height: 1px;
    width: 100%;
    background: #b9b8c3;
    transform-origin: 0 0;
    transform: scaleX(0);
    transition: all 0.2s ease;
  }

  .cbx:hover span:first-child {
    border-color: #99b83c;
  }

  input:checked + .cbx span:first-child {
    border-color: #99b83c;
    background: #99b83c;
    animation: check-15 0.6s ease;
  }

  input:checked + .cbx span:first-child svg {
    stroke-dashoffset: 0;
  }

  input:checked + .cbx span:first-child:before {
    transform: scale(2.2);
    opacity: 0;
    transition: all 0.6s ease;
  }

  input:checked + .cbx span:last-child {
    color: #99b83c;
    transition: all 0.3s ease;
    font-weight: 600;
    font-style: italic;
    
  }

  

  @keyframes check-15 {
    50% {
      transform: scale(1.2);
    }
  }

`

const CurrentHabits = () => {
    const { currentDayHabitIds } = useContext(UserContext);
    const [ statusUpdated, setStatusUpdated ] = useState(false);
    const [habitDetails, setHabitDetails] = useState([]); // State for habit details
    const [loading, setLoading] = useState(true); // State to handle loading
    const [ currentPage, setCurrentPage ] = useState(0); // Tracking current page index
    const habitsPerPage = 3;
    
    const { currentDayHabitInstances, setCurrentDayHabitInstances } = useContext(UserContext);

    // updating of habit status
    const updateHabitStatus = async (habitInstanceId, currentStatus) => {
        try {
            const newStatus = currentStatus === "completed" ? "pending" : "completed";
            // Update status in the backend
            const response = await fetch(`${BASE_URL}/habits/habit-instance/${habitInstanceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newStatus: newStatus }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update habit instance status');
            }
    
            const updatedInstance = await response.json();
           
    
            // Update the status in the UserContext state (still not sure if this works, but maybe useful for when we're finally updating the status in REAL TIME)
            setCurrentDayHabitInstances((prevInstances) =>
                prevInstances.map((instance) =>
                    instance._id === habitInstanceId
                        ? { ...instance, status: newStatus }
                        : instance
                )
            );
            //setStatusUpdated(true);
        } catch (error) {
            console.error('Error updating habit instance status:', error);
        }
    };

    // Fetch habit details
    useEffect(() => {
        const fetchHabits = async () => {
            
            //updating current habits by batch
            try {
                setLoading(true);
                if (currentDayHabitIds && currentDayHabitIds.length > 0) {
                    const { habits, habitInstances } = await fetchHabitDetailsBatch(currentDayHabitIds);
                    setHabitDetails(habits);
                    setCurrentDayHabitInstances(habitInstances);
                    //setStatusUpdated(false);
                }
            } catch (error) {
                console.error('Error catching habits', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHabits();

        
    }, [currentDayHabitIds/*statusUpdated*/]);

    // Calculating visible habits for current page
    const startIndex = currentPage * habitsPerPage;
    const visibleHabits = habitDetails.slice(startIndex, startIndex + habitsPerPage);

     // Handlers for navigation
     const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
     const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(habitDetails.length / habitsPerPage) - 1));
    
     return (
        
        <ContentContainer>
            {loading ? (
                <p>Loading habits...</p>
            ): habitDetails.length === 0 ? (
                //render no habits state here
                <EmptyState />
            ) : (
                <>
                <GraphicContainer>
                    <img src="homepage-main-asset.svg" alt="Illustration" className='fade-in' />
                </GraphicContainer>
    
                <HabitsContainerWrapper className='fade-in'>
                    <NavigationArrows>
                        <button onClick={handlePrev} disabled={currentPage === 0}>
                            &#60;
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={startIndex + habitsPerPage >= habitDetails.length}
                        >
                            &#62;
                        </button>
                    </NavigationArrows>
                    
                        <ul style={{ listStyle: 'none', width: '100%' }}>
                            {visibleHabits.map((habit) => {
                                let parentHabitID = habit._id;

                                // Find the corresponding habit instance by habitId
                                const habitInstance = currentDayHabitInstances.find(
                                    (instance) => instance.habitId === parentHabitID
                                );
                                
                                return (
                                <li key={habit._id} className='slide-in'>
                                    <HabitContainer>
                                        <TimeContainer style={{ marginLeft: '-1.5rem' }}>
                                            <img src="/icons/clock.svg" alt="clock-Illustration" />
                                            <SubInfo style={{ fontSize: '0.5rem' }}>
                                                {habit.timeOfDay}
                                            </SubInfo>
                                        </TimeContainer>
        
                                        <VerticalDivider />
        
                                        <HabitTitleContainer>
                                            <TitleInfo>{habit.name}</TitleInfo>
                                            
                                            <CustomCheckBox>
                                                <input
                                                    className="inp-cbx"
                                                    id={`cbx-${habitInstance._id}`}
                                                    type="checkbox"
                                                    style={{ display: "none" }}
                                                    checked={habitInstance.status === "completed"}
                                                    onChange={() =>
                                                    updateHabitStatus(habitInstance._id, habitInstance.status)}
                                                    
                                                />
                                                <label className="cbx" htmlFor={`cbx-${habitInstance._id}`}>
                                                    <span>
                                                    <svg width="12px" height="7px" viewBox="0 0 12 9">
                                                        <polyline points="1 5 4 8 11 1"></polyline>
                                                    </svg>
                                                    </span>
                                                    <span>{habitInstance.status === "completed"
                                                    ? "Completed"
                                                    : "To-do"}</span>
                                                </label>
                                            </CustomCheckBox>


                                            {/*habitInstance && habitInstance.status !== 'completed' && (
                                                <button
                                                    onClick={() =>
                                                        updateHabitStatus(habitInstance._id, 'completed')
                                                    }
                                                >
                                                    Mark as Done
                                                </button>
                                            )*/}
                                        </HabitTitleContainer>
        
                                        <StreakContainer>
                                            <img
                                                src={
                                                    habit.streak === 0
                                                        ? '/icons/no-streak.svg' // SVG for streak 0
                                                        : '/icons/fire.svg'     // SVG for streak > 0
                                                }
                                                alt="streak-illustration"
                                            />
                                            <SubInfo
                                                style={{
                                                    fontSize: '0.5rem',
                                                    color: habit.streak === 0 ? '#gray' : '#ef5922', // Different colors
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {habit.streak}
                                            </SubInfo>
                                        </StreakContainer>
                                    </HabitContainer>
                                </li>
                            );
                        })}
                        </ul>
                    
                </HabitsContainerWrapper>
                </>
            )
            }
            
        </ContentContainer>
    );
    
};

export default CurrentHabits;

