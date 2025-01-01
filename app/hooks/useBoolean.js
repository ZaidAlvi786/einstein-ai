import { useState, useCallback } from 'react';

// Custom hook to manage boolean state with convenient functions
const useBoolean = (initialState = false) => {
    // State variable to hold the boolean value
    const [value, setValue] = useState(initialState);

    // Function to set the value to true
    const setTrue = useCallback(() => {
        setValue(true);
    }, []);

    // Function to set the value to false
    const setFalse = useCallback(() => {
        setValue(false);
    }, []);

    // Function to toggle the current value (true to false, false to true)
    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);

    // Function to reset the value to the initial state
    const reset = useCallback(() => {
        setValue(initialState);
    }, [initialState]);

    // Return an object with the current value and functions to manipulate it
    return {
        value,      // Current boolean value
        setTrue,    // Function to set value to true
        setFalse,   // Function to set value to false
        toggle,     // Function to toggle value
        reset,      // Function to reset value to initial state
    };
};

export default useBoolean;
