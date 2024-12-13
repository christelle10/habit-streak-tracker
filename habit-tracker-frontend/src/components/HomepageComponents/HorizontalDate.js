import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
    width: 100%;
    overflow-x: hidden;
    color: white;
    top: 0;
    padding-top: 5rem;
    padding-bottom: 2rem;
`;

const MonthHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 1rem;
    position: sticky;
    top: 0;
    z-index: 10;
`;
    
const MonthHeader = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
`;

const Button = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    color: white;
    &:hover {
        color: #72d7f0;
    }
`;

const ScrollableDateRow = styled.div`
    overflow-x: auto;
    display: flex;
    white-space: nowrap; /* ensures content does NOT wrap to multiple lines */
    padding: 0 1rem;
    scroll-snap-type: x mandatory;
    /* Custom Scrollbar */

    &::-webkit-scrollbar {
        height: 0;
    }
    &:hover::-webkit-scrollbar {
        height: 6px; /* Thin scrollbar height */
    }

    &::-webkit-scrollbar-track {
        background: transparent; 
    }

    &::-webkit-scrollbar-thumb {
        background-color: black; 
        border-radius: 3px; 
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #444; 
    }
`;

const DateBox = styled.div`
    flex: 0 0 auto;
    width: 40px;
    text-align: center;
    color: ${({ isCurrentDate, isCurrentMonth }) => 
        isCurrentDate ? 'black' : (isCurrentMonth ? 'white' : '#888')};
    background-color: ${({ isCurrentDate }) => (isCurrentDate ? '#72d7f0' : 'transparent')};
    border-radius: 4px;
`;

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const scrollRef = useRef(null);

    const daysOfWeek = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

    const getDaysInMonth = useCallback((date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }, []);

    const generateCalendarSlots = useCallback((date) => {
        const slots = [];
        const daysInCurrentMonth = getDaysInMonth(date);
        const daysInPrevMonth = getDaysInMonth(new Date(date.getFullYear(), date.getMonth() - 1));
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        //const today = new Date(); // Get today's date
    
        // Fill in previous month's days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            slots.push({ date: daysInPrevMonth - i, isCurrentMonth: false });
        }
    
        // Fill in current month's days
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            slots.push({ date: i, isCurrentMonth: true });
        }
    
        // Fill in next month's days (to ensure a full row)
        const remainingSlots = 42 - slots.length;
        for (let i = 1; i <= remainingSlots; i++) {
            slots.push({ date: i, isCurrentMonth: false });
        }
    
        return slots;
    }, [getDaysInMonth]);

    const [calendarSlots, setCalendarSlots] = useState(generateCalendarSlots(currentMonth));

    const updateCalendarSlots = useCallback((newMonth) => {
        const newSlots = generateCalendarSlots(newMonth);
        setCalendarSlots(newSlots);
    }, [generateCalendarSlots]);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { clientWidth } = scrollRef.current;
        const firstDateBox = scrollRef.current.children[0];
        const lastDateBox = scrollRef.current.children[calendarSlots.length - 1];

        if (!firstDateBox || !lastDateBox) return;

        // Calculate the positions of the first and last date boxes
        const firstDateBoxLeft = firstDateBox.getBoundingClientRect().left;
        const lastDateBoxRight = lastDateBox.getBoundingClientRect().right;

        // Check if the first date box is at the leftmost edge
        if (firstDateBoxLeft >= 0 && firstDateBoxLeft <= 5 && lastDateBoxRight <= clientWidth) {
            setCurrentMonth((prev) => {
                const newMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
                updateCalendarSlots(newMonth);
                return newMonth;
            });
        } 
        // Check if the last date box is at the rightmost edge
        else if (lastDateBoxRight <= clientWidth && lastDateBoxRight >= clientWidth - 5 && firstDateBoxLeft >= 0) {
            setCurrentMonth((prev) => {
                const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
                updateCalendarSlots(newMonth);
                return newMonth;
            });
        }
    };

    useEffect(() => {
        // Update calendar slots when currentMonth changes
        updateCalendarSlots(currentMonth);
    }, [currentMonth, updateCalendarSlots]);
    
    useEffect(() => {
        // Scroll to the position of today's date
        if (scrollRef.current) {
            const today = new Date();
            const todayDate = today.getDate();
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();
    
            // Find the index of today's date in the calendar slots
            const todayIndex = calendarSlots.findIndex(slot =>
                (slot.isCurrentMonth && slot.date === todayDate &&
                currentMonth.getMonth() === todayMonth &&
                currentMonth.getFullYear() === todayYear) ||
                (!slot.isCurrentMonth && slot.date === todayDate &&
                currentMonth.getMonth() === todayMonth - 1 &&
                currentMonth.getFullYear() === todayYear)
            );
    
            // Scroll to today's date if it exists in the current month's view
            if (todayIndex > -1) {
                const todayElement = scrollRef.current.children[todayIndex];
                if (todayElement) {
                    scrollRef.current.scrollLeft = todayElement.offsetLeft - scrollRef.current.clientWidth / 2 + todayElement.clientWidth / 2;
                }
            }
        }
    }, [calendarSlots, currentMonth]);
    
    return (
        <CalendarContainer className='fade-in'>
            <MonthHeaderContainer>
                <Button onClick={() => {
                    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
                    setCurrentMonth(newMonth);
                }}>
                    {"<"}
                </Button>
                <MonthHeader>
                    {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
                </MonthHeader>
                <Button onClick={() => {
                    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
                    setCurrentMonth(newMonth);
                }}>
                    {">"}
                </Button>
            </MonthHeaderContainer>
                <ScrollableDateRow ref={scrollRef} onScroll={handleScroll}>
                    {calendarSlots.map((slot, index) => (
                        <DateBox 
                        key={index} 
                        isCurrentMonth={slot.isCurrentMonth} 
                        isCurrentDate={
                            // For days in the current month
                            (slot.isCurrentMonth && 
                            slot.date === new Date().getDate() && 
                            currentMonth.getMonth() === new Date().getMonth() && 
                            currentMonth.getFullYear() === new Date().getFullYear()) || 
                            
                            // For days in the next month (grayed-out part for the next month)
                            (!slot.isCurrentMonth && 
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, slot.date).toDateString() === new Date().toDateString()) ||
                    
                            // For days in the previous month (grayed-out part for the previous month)
                            (!slot.isCurrentMonth && 
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, slot.date).toDateString() === new Date().toDateString())
                        }
                    >
                        <div>{daysOfWeek[index % 7]}</div>
                        <div>{slot.date}</div>
                    </DateBox>
                    
        ))}
    </ScrollableDateRow>

        </CalendarContainer>
    );
};

export default Calendar;
