import React, { useState } from 'react';
import { forgotPassword } from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const result = await forgotPassword({ email });

        if (result.success) {
            setMessage('Check your email for a reset link.');
        } else {
            setMessage(result.message || 'An error occurred. Please try again later.');
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
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>} {/* Display the message here */}
        </div>
    );
};

export default ForgotPassword;
