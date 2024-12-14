// src/components/Signup.js

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {FormContainer, FormCard, Title, TitleDescription, StyledButton, FloatingLabelContainer, FloatingLabel, InputField, ErrorMessage, StyledLink, StyledParagraph } from './Signup.styles.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar.js';
import { signupUser } from '../utils/api';

const Signup = () => {
    
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [successMessage, setSuccessMessage] = useState('');
    const [message, setMessage] = useState('');
    const handleSignup = async (data) => {
        //using the utility file for api calls:
        const result = await signupUser(data);
        if (result.success) {
            setMessage('Sign up successful! Please check your email to verify your account.');
            setSuccessMessage('Please check your email for verification.');
        } else {
            setMessage(result.message);
        }
        /*
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        if (response.status === 201) {
            setMessage('Sign up successful! Please check your email to verify your account.');
            setSuccessMessage('Please check your email for verification.');
        } else {
            setMessage(`Error: ${responseData.message}`);
        }*/
    };

    return (
        <FormContainer>
            <Navbar />
            <FormCard className='fade-in'>
                <Title>Get Started</Title>
                <TitleDescription>Start your journey in changing your life, one step at a time.</TitleDescription>

                <form onSubmit={handleSubmit(handleSignup)}>
                    {['username', 'email', 'password'].map((field) => (
                        <FloatingLabelContainer key={field}>
                        <InputField
                            type={field === 'password' ? 'password' : 'text'}
                            {...register(field, {
                                required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                                ...(field === 'password' && { minLength: { value: 6, message: 'Password must be at least 6 characters' } }),
                            })}
                            placeholder=" " // This is important for the floating label to work
                            value={watch(field)} // Bind value to watch the field's input value
                        />
                        <FloatingLabel htmlFor={field} className={errors[field] ? 'is-invalid' : ''}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </FloatingLabel>
                        {errors[field] && <ErrorMessage>{errors[field].message}</ErrorMessage>}
                    </FloatingLabelContainer>
                    ))}
                    
                    <StyledButton type="submit">Sign Up</StyledButton>
                </form>

                
                {message && <p className="mt-3">{message}</p>}
    
                <StyledParagraph>
                    Already have an account? 
                    <StyledLink to="/signin"> Sign In</StyledLink>
                </StyledParagraph>
            </FormCard>
        </FormContainer>
    );
};

export default Signup;
