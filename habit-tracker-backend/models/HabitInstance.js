const mongoose = require('mongoose');

const habitInstanceSchema = new mongoose.Schema({
    habitId: {type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true}, //linking instance to parent Habit
    date: {type: Date, required: true},
    status: {type: String, enum: ['pending', 'completed', 'missed'], reguired: true}, 
});

const HabitInstance = mongoose.model('HabitInstance', habitInstanceSchema);
module.exports = HabitInstance;
