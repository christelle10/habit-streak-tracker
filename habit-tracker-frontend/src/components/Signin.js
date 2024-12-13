// src/components/Signin.js

import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, FormCard, Title, TitleDescription, StyledButton, StyledPositiveButton, FloatingLabelContainer, FloatingLabel, InputField, ErrorMessage, StyledLink, StyledParagraph } from './Signup.styles.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar.js';
import { UserContext } from './UserContext.js';
import { useNavigate } from 'react-router-dom';


const Signin = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [message, setMessage] = useState('');
    const { setUsername } = useContext(UserContext);
    const navigate = useNavigate();
    const { setCurrentDayHabitIds } = useContext(UserContext);
    const { setCurrentDayHabitInstances } = useContext(UserContext);

    const handleSignin = async (data) => {
        console.log('Form Data:', data);
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        
        if (response.status === 200) {
            setMessage('Sign in successful!');
            setUsername(data.username); 
            setCurrentDayHabitIds(responseData.habitIds);
            setCurrentDayHabitInstances(responseData.habitInstances);
            navigate('/homepage'); // redirect to dashboard or homepage here
        } else if (response.status === 401) {
            setMessage('Incorrect password. Please try again.');
        } else if (response.status === 404) {
            setMessage('User not found. Please check your username.');
        } else {
            setMessage(`Error: ${responseData.message}`);
        }
    };

    return (
    
        <FormContainer>
            <Navbar />
            <FormCard className='fade-in'>
                <Title>Sign In</Title>
                <TitleDescription>Start your journey in changing your life, one step at a time.</TitleDescription>

                <form onSubmit={handleSubmit(handleSignin)}>
                    {['username', 'password'].map((field) => (
                        <FloatingLabelContainer key={field}>
                            <InputField
                                type={field === 'password' ? 'password' : 'text'}
                                {...register(field, {
                                    required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                                    ...(field === 'password' && { minLength: { value: 6, message: 'Password must be at least 6 characters' } }),
                                })}
                                placeholder=" " // Floating label behavior
                                value={watch(field)}
                            />
                            <FloatingLabel htmlFor={field} className={errors[field] ? 'is-invalid' : ''}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </FloatingLabel>
                            {errors[field] && <ErrorMessage>{errors[field].message}</ErrorMessage>}
                        </FloatingLabelContainer>
                    ))}

                    <StyledButton type="submit">Sign In</StyledButton>
                </form>

                {message && <p className="mt-3">{message}</p>}
                <StyledParagraph>
                    Forgot your password? <StyledLink to="/forgot-password"> Reset Password</StyledLink>
                </StyledParagraph>
                <StyledLink to="/signup" textDecoration='none'><StyledPositiveButton type="submit">Create an account </StyledPositiveButton></StyledLink>
                
            </FormCard>
        </FormContainer>
    
    );
};

export default Signin;
