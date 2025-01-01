import { useState, useEffect } from 'react';

// Custom hook for debounce functionality
function useDebounce(value, delay) {
  // State and setter for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear timeout if the value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

// Example usage:
// In your component:
// const [inputValue, setInputValue] = useState('');
// const debouncedValue = useDebounce(inputValue, 500);

// useEffect(() => {
//   // This will execute after 500ms of user stopping typing
//   if (debouncedValue) {
//     // Trigger your search function here or perform any action
//   }
// }, [debouncedValue]);

export default useDebounce;
