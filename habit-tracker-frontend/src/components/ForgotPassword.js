import React, { useState } from 'react';
import { forgotPassword } from '../utils/api';
import { StyledLabel, FormContainer, FormCard, Title, TitleDescription, StyledButton, FloatingLabelContainer, FloatingLabel, InputField, ErrorMessage, StyledLink, StyledParagraph } from './Signup.styles.js';
import Navbar from './Navbar.js';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const result = await forgotPassword({ email });

        if (result.success) {
            setMessage('Check your email for a reset link.');
            console.log("Sent reset link to email");
        } else {
            setMessage(result.message || 'An error occurred. Please try again later.');
            console.log("Email verification for forgot password failed");
        }
        /*
        try {
            const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.status === 200) {
                setMessage('Check your email for a reset link.');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }*/
    };

    return (
        <FormContainer>
            <Navbar />
            <FormCard onSubmit={handleForgotPassword}>
                <Title>Forgot Password</Title>
                <TitleDescription>Enter the email you used to create an account.</TitleDescription>
                <FloatingLabelContainer>
                    <StyledLabel>Email:</StyledLabel>
                    <InputField 
                        type="email" 
                        value={email} 
                        placeholder=" "
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </FloatingLabelContainer>
                <StyledButton type="submit">Send Reset Link</StyledButton>
                {message && <StyledParagraph>{message}</StyledParagraph>} {/* Display the message here */}
                <StyledParagraph>
                    Remembered your password already? Go back to <StyledLink to="/signin">Sign In.</StyledLink>
                </StyledParagraph>
            </FormCard>
            
        </FormContainer>
    );
};

export default ForgotPassword;
