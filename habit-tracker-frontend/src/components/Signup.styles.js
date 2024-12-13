// src/components/Signup.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';


/*export const NavbarContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
`

export const Logo = styled.img`
    margin-right: 1rem;
`*/

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-image: url('/field-background.svg'); 
    background-size: cover; /* Cover the entire container */
    background-repeat: no-repeat; /* Prevent repeat */
    background-position: center; /* Center the background */
`;

export const FormCard = styled.div`
    background: rgb(181,226,255);
    background: linear-gradient(180deg, rgba(181,226,255,1) 0%, rgba(246,246,246,0.66) 24%);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    
`;

export const Title = styled.h1`
    margin-bottom: 0.2rem;
    color: #333;
    text-align: center;
    font-weight: 600;
    font-size: 2rem;
`;

export const TitleDescription = styled.h3`
    margin-bottom: 1.5rem;
    color: #333;
    text-align: center;
    font-weight: 400;
    font-size: 1rem;
`;

export const StyledButton = styled.button`
    background: #252329;
    font-weight: 600;
    color: white;
    border: 1px solid black;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    width: 100%;
    margin-top: 0.5rem;
    &:hover {
        background: #3d3b42;
    }
`;

export const StyledPositiveButton = styled.button`
    background: #74b32c;
    font-weight: 600;
    color: white;
    border: 0px solid black;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    width: 75%;
    margin: 0.5rem auto 0 auto; /* Centers the button horizontally */
    display: block; /* Ensures it behaves like a block-level element */
    &:hover {
        background: #5b8d22;
    }
`;


//explain:
export const FloatingLabelContainer = styled.div`
    position: relative;
    margin-bottom: 1.5 rem;
`;


//explain:
export const InputField = styled.input`
    padding: 12px 12px 12px 12px; /* Adjust padding for better spacing */
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 15px;
    width: 100%;
    &:focus {
        border-color: #007bff;
        outline: none; /* Optional: Change border color on focus */
    }

    &::placeholder {
        color: transparent; /* Hide the placeholder text */
    }
`;

//explain:
export const FloatingLabel = styled.div`
    position: absolute;
    margin-left: 15px;
    left: 12 px;
    top: 12px;
    color: gray;
    transition: 0.2s ease all;
    pointer-events: none;
    /* Hide the label when input is focused or has a value */
    ${InputField}:focus + &,
    ${InputField}[value]:not([value=""]) + & {
        display: none; /* Hide the label */
`;
export const ErrorMessage = styled.div`
    color: red; /* Error text color */
    font-size: 0.875rem; /* You can adjust the font size */
    margin-top: -1rem; /* Adjust the margin to reduce the gap */
    margin-bottom: 1rem;
    
    text-align: left; /* Align the error message */
    padding-left: 0.1rem; /* Add some padding to position it nicely */
`;

export const StyledParagraph = styled.p`
    margin-top: 1rem;
    color: #645e6e;
    text-align: center;
`

export const StyledLink = styled(Link)`
    margin-top: 1rem;
    color: #333;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    &:hover {
        color:#645e6e }
`
