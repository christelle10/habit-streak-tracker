const express = require('express');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Habit = require('../models/Habit');
const HabitInstance = require('../models/HabitInstance');
const User = require('../models/User');
const router = express.Router();
const { getCurrentHabitInstances } = require('../services/getInstance');

// Creating and adding a new habit ... also added for creating new habit instances if it applies
router.post('/add', async (req, res) => {
    const { username, name, frequency, daysOfWeek, timeOfDay, location, streak } = req.body;

    try {

        //check if the username exists in the user collection 
        const userExists = await User.findOne({ username });
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        //creating of habits
        const habit = new Habit({
            username,
            name,
            frequency,
            daysOfWeek: frequency === 'weekly' ? daysOfWeek : [], // Only store days if weekly
            timeOfDay,
            location,
            streak,
        });
        const savedHabit = await habit.save();

        //creating of habit instances
        const today = new Date(); // Current date
        const todayDay = today.toLocaleString('en-US', { weekday: 'long' }); // Get current day in lowercase (e.g., "monday")
        const todayStart = moment().utc().startOf('day').toDate();
        if (
            frequency === 'daily' || 
            (frequency === 'weekly' && daysOfWeek.includes(todayDay)) 
        ) {
            await HabitInstance.create({
                habitId: savedHabit._id,
                date: todayStart,
                status: 'pending',
            });
        }
        res.status(201).json(savedHabit);
    } catch (error) {
        console.error('Error while adding habit:', error); // Log the error
        res.status(500).json({ error: 'Failed to add habit' });
    }
});

// Route to get habits by username
router.get('/user/:username', async (req, res) => {
    const username = req.params.username; // Retrieve the username from URL params

    try {
        // Query for all habits associated with this username
        const userHabits = await Habit.find({ username: username });
        
        // If habits are found, send them back in the response
        res.status(200).json(userHabits);
    } catch (error) {
        console.error('Error retrieving user habits:', error);
        res.status(500).json({ error: 'Failed to retrieve user habits' });
    }
});

// For retrieving habits by habitId
router.get('/:habitId', async (req, res) => {
    const { habitId } = req.params; // Retrieve the habitId from URL params

    try {
        // Query for the habit by habitId
        const habit = await Habit.findById(habitId);

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // If habit is found, send it back in the response
        res.status(200).json(habit);
    } catch (error) {
        console.error('Error retrieving habit:', error);
        res.status(500).json({ error: 'Failed to retrieve habit' });
    }
});

//instead of habitID, this route will try to fetch the current habits by batch
router.post('/batch', async (req, res) => {
    const habitIds = req.body.ids; //Ids to be sent in the body as an array
    
    try {
        //for batch fetching of Parent Habit details
        const habits = await Habit.find({_id: { $in: habitIds } });

        //for batch fetching habit instances
        const habitInstances = await getCurrentHabitInstances(habitIds);

        //send both habits and instances
        res.json({ habits, habitInstances });
        

    } catch (err) {
        console.error('Error in /batch route:', err.message || err);
        res.status(500).json({ message: 'Failed to fetch habits and instances' });
    }

})


//for updating of habit status
router.put('/habit-instance/:id', async (req, res) => {
    const { id } = req.params; // Get habit instance ID from the URL
    const { newStatus} = req.body; // Get new status from the request body
    console.log(newStatus);

    try {
        // Validate the status field
        if (!['pending', 'completed', 'skipped'].includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find the habit instance by ID and update the status
        const updatedHabitInstance = await HabitInstance.findOneAndUpdate(
            { _id: id }, //search habit instance by its unique object ID
            { status: newStatus }, //update its status 
            { new: true } // Return the updated document
        );

        if (!updatedHabitInstance) {
            return res.status(404).json({ error: 'Habit instance not found' });
        }

        // Respond with the updated habit instance
        res.status(200).json({ message: 'Habit instance updated successfully', updatedHabitInstance });
    } catch (error) {
        console.error('Error updating habit instance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//for fetching all parent habits by user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const habits = await Habit.find({ username: userId });
      console.log(habits);
      res.json(habits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      res.status(500).json({ error: 'Failed to fetch habits' });
    }
  });

  // DELETE route to remove a habit and related habit instances
router.delete('/delete/:habitId', async (req, res) => {
    const { habitId } = req.params;
  
    try {
      // Delete all HabitInstances linked to the habitId
      await HabitInstance.deleteMany({ habitId: habitId });
  
      // Delete the habit itself
      const result = await Habit.findByIdAndDelete(habitId);
  
      if (!result) {
        return res.status(404).json({ message: 'Habit not found' });
      }
  
      return res.status(200).json({ message: 'Habit and related instances deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });


module.exports = router;
