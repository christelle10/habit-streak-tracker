import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import to get the token from the URL
import { resetPassword } from '../utils/api';
import { StyledLabel, FormContainer, FormCard, Title, TitleDescription, StyledButton, FloatingLabelContainer, FloatingLabel, InputField, ErrorMessage, StyledLink, StyledParagraph } from './Signup.styles.js';
import Navbar from './Navbar.js';
const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate(); // For navigation after reset
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        const result = await resetPassword({ token, newPassword });

        if (result.success) {
            setMessage('Password reset successful! You can now sign in.');
            setTimeout(() => navigate('/signin'), 2000);
        } else {
            setMessage(result.message || 'An error occurred. Please try again later.');
        }
        /*
        try {
            const response = await fetch('http://localhost:5001/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token, // Include the token from the URL
                    newPassword,
                }),
            });

            const data = await response.json();
            if (response.status === 200) {
                setMessage('Password reset successful! You can now sign in.');
                setTimeout(() => navigate('/signin'), 2000); // Redirect to signin after 2 seconds
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }  
        */
    };

    return (
        <FormContainer>
            <Navbar />
            <FormCard className ='fade-in'>
                <form onSubmit={handlePasswordReset}>
                    <Title>Reset Password</Title>
                    <TitleDescription>Enter new password to reset your account.</TitleDescription>
                    <FloatingLabelContainer>
                        <StyledLabel>New Password:</StyledLabel>
                        <InputField 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                    </FloatingLabelContainer>
                    <StyledButton type="submit">Reset Password</StyledButton>
                </form>
                <StyledParagraph>Go back to <StyledLink to="/signin">Sign In</StyledLink>.</StyledParagraph>
            </FormCard>
            {message && <StyledParagraph>{message}</StyledParagraph>} {/* Display success or error message */}
            
        </FormContainer>
    );
};

export default ResetPassword;
