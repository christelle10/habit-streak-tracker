
/*export const fetchHabitDetails = async (habitId) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/habits/${habitId}`);
        return response.data; // Return the habit details
    } catch (error) {
        console.error(`Failed to fetch details for habit ${habitId}:`, error);
        throw error; // Propagate the error for handling in the caller
    }
};*/

export const fetchHabitDetailsBatch = async (CurrentDayHabitIds) => {
    try {
        const response = await fetch('http://localhost:5001/api/habits/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( { ids: CurrentDayHabitIds }),
        });
        const { habits, habitInstances } = await response.json();
        console.log('response body fetched from HabitDetails.js', response);
        return { habits, habitInstances };

    } catch (error) {
        console.error('Error fetching habits:', error);
        throw error;
    }
};


