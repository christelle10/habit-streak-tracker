import React from 'react';
import styled from 'styled-components';



const NavbarContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: none; /* Set a background color or make it semi-transparent */
    padding: 1rem; /* Add padding for spacing */
    position: fixed; /* Fix the navbar at the top */
    top: 0; /* Position it at the very top */
    left: 0; /* Align it to the left */
    right: 0; /* Stretch it to the right */
    z-index: 1000; /* Ensure it stays above other content */
`;

const Logo = styled.img`
    height: 80px; /* Adjust size as needed */
    margin-right: 25rem; /* Spacing between logo and other navbar items */
    margin-left: 2rem;
`;

const Navbar = () => {
    return (
        <NavbarContainer>
            <Logo src={'habit-streak-logo.png'} alt="Logo" />
            {/* Add your other navbar items here, like links */}
            {/*<nav>
                <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0, padding: 0 }}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>*/}
        </NavbarContainer>
    );
};

export default Navbar;
