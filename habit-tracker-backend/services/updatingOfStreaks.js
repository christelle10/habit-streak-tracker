const HabitInstance = require('../models/HabitInstance');
const Habit = require('../models/Habit');
const moment = require('moment-timezone'); // Ensure moment-timezone is installed

const updateStreaks = async (userId) => {
    try {
      // Get yesterday's date in Philippine Time (PHT) and convert it to UTC
        const yesterdayStartInPH = moment().tz('Asia/Manila').subtract(1, 'days').startOf('day'); // Start of yesterday
        const yesterdayEndInPH = moment().tz('Asia/Manila').subtract(1, 'days').endOf('day'); // End of yesterday
  
      // Convert these times to UTC
      const yesterdayStartUTC = yesterdayStartInPH.utc().toDate();
      const yesterdayEndUTC = yesterdayEndInPH.utc().toDate();
  
      // Fetch habits and their instances for the user
      const habits = await Habit.find({ username: userId });
      const habitIds = habits.map((habit) => habit._id);
  
      // Query HabitInstances for the previous day (yesterday in UTC)
      const yesterdayInstances = await HabitInstance.find({
        habitId: { $in: habitIds },
        date: { $gte: yesterdayStartUTC, $lt: yesterdayEndUTC }, // Use UTC here
      });
  
      // Map habit instances by their habitId
      const instanceMap = {};
      yesterdayInstances.forEach((instance) => {
        instanceMap[instance.habitId] = instance.status;
      });
  
      // Update streaks based on yesterday's data
      for (const habit of habits) {
        const yesterdayStatus = instanceMap[habit._id];

        // Log the habit's current streak before updating
        //console.log(`Current streak for habit "${habit.name}": ${habit.streak}`);

        if (yesterdayStatus === 'completed') {
          // Increment streak if completed
          habit.streak += 1;
          //console.log(`Incremented streak for habit "${habit.name}" to ${habit.streak}`);
        } else if (habit.streak > 0) {
          // Reset streak to 0 if missed
          habit.streak = 0;
          //console.log(`Streak reset to 0 for habit "${habit.name}"`);
        }

        // Save the updated habit
        const updatedHabit = await habit.save();
        //console.log(`Updated habit "${habit.name}" with streak: ${updatedHabit.streak}`);
      }
  
      //console.log('Streaks updated successfully');
    } catch (error) {
      console.error('Error updating streaks:', error);
    }
};

module.exports = { updateStreaks };
