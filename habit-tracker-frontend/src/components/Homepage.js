// src/components/Signin.js
import React from 'react';
import Calendar from "./HomepageComponents/HorizontalDate";
import CurrentHabits from './HomepageComponents/CurrentHabits';
import BottomNavBar from './HomepageComponents/BottomNav';
import styled from 'styled-components';



const HomepageContainer = styled.div`
    display: block;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    overflow-y: auto;
    background-color: #252329;
`;

const Homepage = () => {
    return (
    
            <HomepageContainer>
                <Calendar />
                <CurrentHabits />
                <BottomNavBar />
                
            </HomepageContainer>
    )
};

export default Homepage;
