const Habit = require('../models/Habit');
const HabitInstance = require('../models/HabitInstance');
const moment = require('moment-timezone'); // Install moment-timezone if not already installed

const generateTasksForToday = async (username) => {
    // Get today's date in the Philippines time zone
    let currentDayHabits = [];
    const todayStart = moment().tz('Asia/Manila').startOf('day').toDate();
    const todayEnd = moment().tz('Asia/Manila').endOf('day').toDate();

    // Get the current day name (e.g., 'Monday', 'Tuesday')
    const currentDay = moment().tz('Asia/Manila').format('dddd');

    try {
        // Fetch daily and weekly habits for the user
        const dailyHabits = await Habit.find({ username, frequency: 'daily' });
        const weeklyHabits = await Habit.find({
            username,
            frequency: 'weekly',
            daysOfWeek: { $in: [currentDay] },
        });

         //store the filtered daily & weekly habits to currentDayHabits using spread syntax
         currentDayHabits.push(...dailyHabits.map(habit => habit._id));
         currentDayHabits.push(...weeklyHabits.map(habit => habit._id));

        if (currentDayHabits.length === 0) {
            //console.log('No habits to form today.');
            return;
        }

        for (const habit of currentDayHabits) {
            const habitId = habit._id;

            // Check if a HabitInstance already exists for this habit today
            const existingInstance = await HabitInstance.findOne({
                habitId,
                date: { $gte: todayStart, $lt: todayEnd },
            });

            if (existingInstance) {
                //console.log(`HabitInstance for habit ${habitId} on ${todayStart} already exists.`);
                continue;
            }

            // Create a new HabitInstance for today
            await HabitInstance.create({
                habitId,
                date: todayStart, // Store in UTC (start of day in Philippines)
                status: 'pending',
            });

            //console.log(`Task for habit ${habitId} created successfully!`);
        }
        //console.log(currentDayHabits);
        //console.log('All tasks generated successfully.');
        return currentDayHabits;
    } catch (error) {
        console.error('Error generating tasks:', error.message);
        throw error; // Re-throw the error for debugging or higher-level handling
    }
};

module.exports = { generateTasksForToday };
