const HabitInstance = require('../models/HabitInstance');
const moment = require('moment-timezone'); // Ensure moment-timezone is installed

const getCurrentHabitInstances = async (habitIds) => {
    try {
        // Get the start and end of today in the Philippine timezone
        const todayStartInPH = moment().tz('Asia/Manila').startOf('day');
        const todayEndInPH = moment().tz('Asia/Manila').endOf('day');

        // Convert these times to UTC
        const todayStartUTC = todayStartInPH.utc().toDate();
        const todayEndUTC = todayEndInPH.utc().toDate();

        /*console.log('Querying UTC date range:', todayStartUTC, todayEndUTC);
        console.log('Querying for habit IDs:', habitIds);*/

        // Query the database using the UTC range and multiple habit IDs  
        const habitInstances = await HabitInstance.find({
            habitId: { $in: habitIds }, // Match any of the habit IDs in the array
            date: { $gte: todayStartUTC, $lt: todayEndUTC }, // Compare using UTC times
        });

        if (habitInstances.length > 0) {
            /*console.log('Found habit instances:', habitInstances);*/
            return habitInstances;
        } else {
            console.log('No habit instances found for today for the provided habit IDs.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching habit instances:', error.message || error);
        throw new Error('Error fetching habit instances');
    }
};

module.exports = { getCurrentHabitInstances };
