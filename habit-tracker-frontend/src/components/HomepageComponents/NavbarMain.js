import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { UserContext } from '/Users/christelleridad/habit-streak-tracker/habit-tracker-frontend/src/components/UserContext.js';



const NavbarContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 2rem; 
    height: 60px; 
    position: fixed; 
    background-color: #1f1e1e;
    top: 0; 
    left: 0; 
    right: 0; 
    z-index: 1000; 
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
`;

const NavList = styled.ul`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
    justify-content: space-between;
`;


const NavItem = styled.li`
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    

    a {
        color: white; /* Text color */
        text-decoration: none;
        font-weight: 600;

        &:hover {
            color: gray; /* Lighter color on hover */
        }
    }

    &:last-child {
        margin-left: auto; 
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    font-weight: 600;
    color: white; /* Text color */
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        color: gray; /* Lighter color on hover */
    }
`;



const NavbarMain = () => {
    const { username, setUsername } = useContext(UserContext);
    const { currentDayHabitIds, setCurrentDayHabitIds} = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        setUsername(null);
        setCurrentDayHabitIds([]);
    }
    useEffect(() => {
        if (username === null && currentDayHabitIds.length === 0) {
            navigate('/signin');
        }
    }, [username, currentDayHabitIds, navigate]);

    
    return (
        <NavbarContainer>
            
                <NavList>
                    <NavItem>
                      
                        <CgProfile style={{ color: 'white', fontSize: '30px' }} />
                    </NavItem>
                    <NavItem>
                            
                            <Link to="/">
                                Hi, {username ? username : 'GUEST'}!
                            </Link>
                    </NavItem>
                    <NavItem>
                        <LogoutButton onClick={handleLogout}>LOGOUT</LogoutButton>
                    </NavItem>
                </NavList>
        </NavbarContainer>
    );
};
export default NavbarMain;
