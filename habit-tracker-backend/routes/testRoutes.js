const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure dotenv is configured

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Test email route
router.get('/test-email', (req, res) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'cottagecore.hoee@gmail.com', // Change to a valid email address
        subject: 'Test Email',
        text: 'This is a test email.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending test email:', error);
            return res.status(500).json({ message: 'Error sending test email', error });
        }
        res.status(200).json({ message: 'Test email sent successfully!', info });
    });
});

module.exports = router; // Ensure the router is exported
