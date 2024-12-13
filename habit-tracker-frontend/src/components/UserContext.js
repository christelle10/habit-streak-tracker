import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

    //Updating and storing of username data
    const [username, setUsername] = useState(() => {
        // retrieve username from local storage on initialization
        return localStorage.getItem('username') || null;
    });
     //Updating and storing of current day's habit data
    const [currentDayHabitIds, setCurrentDayHabitIds] = useState(() => {
        const storedIds = localStorage.getItem('currentDayHabitIds');
        console.log('Restored IDs from localStorage:', storedIds);
        return storedIds ? JSON.parse(storedIds) : [];
    });
    //Updating and storing of current day's habit instances
    const [currentDayHabitInstances, setCurrentDayHabitInstances] = useState(() => {
        const storedInstances = localStorage.getItem('currentDayHabitInstances');
        return storedInstances ? JSON.parse(storedInstances) : [];
    });

     // Adding habits to the context
    const [habits, setHabits] = useState(() => {
        const storedHabits = localStorage.getItem("habits");
        return storedHabits ? JSON.parse(storedHabits) : [];
    });

    // update local storage when username changes
    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username) //save to local storage
        } else {
            localStorage.removeItem('username'); //if null
        }
    }, [username]);
    // update local storage when current day's habit data changes
    useEffect(() => {
        try {
            if (currentDayHabitIds && currentDayHabitIds.length > 0) {
                localStorage.setItem('currentDayHabitIds', JSON.stringify(currentDayHabitIds));
            } else {
                //localStorage.removeItem('currentDayHabitIds'); // if null
            }
        }
         catch (error) {
            console.error('Failed to save currentDayHabitIds to localStorage:', error);
        }
    }, [currentDayHabitIds]);
    // update local storage when current habit instances changes
    // Update localStorage for currentDayHabitInstances
    useEffect(() => {
        if (currentDayHabitInstances && currentDayHabitInstances.length > 0) {
            localStorage.setItem(
                'currentDayHabitInstances',
                JSON.stringify(currentDayHabitInstances)
            );
        } else {
            localStorage.removeItem('currentDayHabitInstances');
        }
    }, [currentDayHabitInstances]);

    // Update local storage for habits
    useEffect(() => {
        if (habits && habits.length > 0) {
        localStorage.setItem("habits", JSON.stringify(habits));
        } else {
        localStorage.removeItem("habits");
        }
    }, [habits]);
    /*const [currentDayHabitIds, setCurrentDayHabitIds] = useState([]);
    console.log("UserProvider username:", username);*/
    return (
        <UserContext.Provider value={{ 
            username, 
            setUsername, 
            currentDayHabitIds, 
            setCurrentDayHabitIds,
            currentDayHabitInstances,
            setCurrentDayHabitInstances,
            habits,
            setHabits, }}>
            {children}
        </UserContext.Provider>
    );
};
