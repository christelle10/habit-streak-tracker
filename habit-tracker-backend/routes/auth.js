const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); //to securely hash passwords before saving to database
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); //allows us to send emails from server 
const crypto = require('crypto'); // for generating email-verification tokens
const router = express.Router();
const { generateTasksForToday } = require('../services/generateTasks');
const { getCurrentHabitInstances } = require('../services/getInstance');
const { updateStreaks } = require('../services/updatingOfStreaks');
require('dotenv').config(); // Ensure dotenv is configured

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true,
});

// Registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const expirationTime = Date.now() + 3600000; // Token valid for 1 hour

    // Create a new user
    const user = new User({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: verificationToken, // Generate verification token
        tokenExpiration: expirationTime
    });

    try {
        // Save the user to the database
        await user.save();

        

        // Send verification email
        const verificationLink = `http://localhost:5001/api/auth/verify-email/${verificationToken}`;
        console.log('Sending verification email to:', email);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,700;1,700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');
                </style>

                <div style="font-family: Raleway, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://i.imgur.com/tquC1bu.png" alt="Logo" style="max-width: 150px;">
                    </div>
                    <h2 style="text-align: center; color: #333;">Welcome to steps2habits!</h2>
              
                    <p style="color: #555; line-height: 1.5;">
                        Thank you for signing up with steps2habits! To complete your registration and activate your account, please verify your email address by clicking the button below:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationLink}" style="background-color: #007BFF; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">
                            Verify My Email
                        </a>
                    </div>
                    <p style="color: #555; line-height: 1.5;">
                        If you didn't request this email, please ignore it. If you have any questions, feel free to contact me at 
                        <a href="mailto:christellejoyridad@gmail.com" style="color: #007BFF;">christellejoyridad@gmail.com</a>.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="text-align: center; color: #aaa; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} steps2habits. All rights reserved.
                    </p>
                </div>

            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
        return res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error registering user', error });
    }
});

// Email Verification Route
router.get('/verify-email/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Here you would typically look up the user associated with the token
        // For simplicity, we will not implement token storage for now
        // You could create a `verificationToken` field in your User model
        
        // Find the user by email (assuming you can relate the token to an email)
        const user = await User.findOne({ 
            verificationToken: token,
            tokenExpiration: { $gt: Date.now() } // Check if token is not expired 
        });

        if (!user) {
            return res.status(400).send('Invalid token or user not found.');
        }

        // Update the user's verification status
        user.isVerified = true; // Set to true upon verification
        user.verificationToken = undefined; // Optionally remove the token
        user.tokenExpiration = undefined;
        await user.save(); // Save the updated user to the database

        res.send('Email verified successfully!');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Internal server error.');
    }
});
 

// Sign-in Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        //updating streak
        const streakUpdate = await updateStreaks(username);
        console.log('update of streak:', streakUpdate);

        // after successful login, generate tasks for today
        const currentDayHabits = await generateTasksForToday(username);

        // Call the function to get the habit instances for today
        const habitInstance = await getCurrentHabitInstances(currentDayHabits);

        
        
        // Return success message
        return res.status(200).json({ 
            message: 'Login successful & tasks generated!',
            habitIds: currentDayHabits,
            habitInstances: habitInstance,

        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error while logging in', error });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour validity

        user.resetPassToken = resetToken;
        user.resetPassTokenExpiration = resetTokenExpiration;
        await user.save();

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 1 hour.</p>`,
        };
        console.log(`Reset Token: ${resetToken}`);


        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Check your email for a reset link' }); // Success response
    } catch (error) {
        return res.status(500).json({ message: 'Error sending reset link', error });
    }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find the user by the reset token and check if it's still valid
        const user = await User.findOne({
            resetPassToken: token,
            resetPassTokenExpiration: { $gt: Date.now() }, // Ensure token has not expired
        });
        console.log(`Incoming token: ${token}`);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset token fields
        user.password = hashedPassword;
        user.resetPassToken = undefined;
        user.resetPassTokenExpiration = undefined;

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Error resetting password', error });
    }
});
module.exports = router;
