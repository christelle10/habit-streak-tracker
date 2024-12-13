import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import to get the token from the URL

const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate(); // For navigation after reset
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

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
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
                <div>
                    <label>New Password:</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>} {/* Display success or error message */}
        </div>
    );
};

export default ResetPassword;
