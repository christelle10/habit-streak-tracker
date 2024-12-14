import React, { useState, useContext, useCallback } from "react";
import UserProgressModal from "./YourProgressModal";
import { UserContext } from "../UserContext";

const BASE_URL = "https://habit-tracker-backend-l8el.onrender.com/api";

const UserProgressButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { username, habits, setHabits } = useContext(UserContext); // Removed setUsername, as it's not used

  // Function to fetch habits
  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const userId = username; // Replace with the actual logged-in user ID
      const response = await fetch(`${BASE_URL}/habits/user/${userId}`); // Adjust the API route

      if (!response.ok) {
        throw new Error(`Failed to fetch habits: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("data from userbtn", data);
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  }, [username]); // Ensure fetchHabits re-runs if username changes

  // Handle button click
  const handleButtonClick = () => {
    fetchHabits();
    setIsModalOpen(true);
    
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setHabits([]); // Clear habits when closing the modal
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Your Progress
      </button>
      {isModalOpen && (
        <UserProgressModal
          onClose={handleModalClose}
          loading={loading}
          acceptedHabits={habits}
        />
      )}
    </>
  );
};

export default UserProgressButton;
