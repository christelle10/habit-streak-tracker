// src/utils/api.js

const BASE_URL = "https://habit-tracker-backend-l8el.onrender.com/api";

// Function to handle Sign In
export async function signinUser(data) {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to sign in.');
        }

        return {
            success: true,
            data: responseData,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

// Add other authentication-related functions here
// Example: Sign Up, Forgot Password, Reset Password

export async function signupUser(data) {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to sign up.');
        }

        return {
            success: true,
            data: responseData,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

export async function forgotPassword(data) {
    try {
        const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to process forgot password request.');
        }

        return {
            success: true,
            data: responseData,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

// Function to handle Reset Password
export async function resetPassword(data) {
    try {
        const response = await fetch(`${BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to reset password.');
        }

        return {
            success: true,
            data: responseData,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

// For fetching habit details by batch
export async function fetchHabitDetailsBatch(CurrentDayHabitIds) {
    try {
        const response = await fetch(`${BASE_URL}/habits/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: CurrentDayHabitIds }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch habit details.');
        }

        const responseData = await response.json();
        return {
            success: true,
            data: responseData,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}


//updating of habit status
export async function updateHabitStatus(habitInstanceId, currentStatus) {
    try {
        const newStatus = currentStatus === "completed" ? "pending" : "completed";

        const response = await fetch(`${BASE_URL}/habits/habit-instance/${habitInstanceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newStatus }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update habit instance status.');
        }

        const updatedInstance = await response.json();

        return {
            success: true,
            data: updatedInstance,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}