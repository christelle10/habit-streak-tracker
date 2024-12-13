const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    username: { type: String, ref: 'User', required: true },
    name: { type: String, required: true }, // Habit Name
    frequency: {
        type: String,
        enum: ['daily', 'weekly'],
        required: true
    }, // Habits could be daily or weekly
    daysOfWeek: { type: [String], default: [] }, // Days for weekly habits
    timeOfDay: { type: String, required: true }, // Time for habit
    location: { type: String }, // Location for the habit
    streak: { type: Number, default: 0 } // Habit streak counter
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
