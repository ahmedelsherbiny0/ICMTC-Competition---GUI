import React from 'react';

// --- Type Definitions for Props ---
interface NumberInputProps {
  /** The current numerical value of the input. */
  value: number;
  /** A callback function that fires when the value changes. */
  onChange: (newValue: number) => void;
  /** The minimum allowed value (defaults to 0). */
  min?: number;
  /** The maximum allowed value (defaults to 10). */
  max?: number;
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = 10,
}: NumberInputProps) {
  
  const handleIncrement = () => {
    onChange(Math.min(value + 1, max));
  };

  const handleDecrement = () => {
    onChange(Math.max(value - 1, min));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
        onChange(min);
        return;
    }
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      const clampedValue = Math.max(min, Math.min(num, max));
      onChange(clampedValue);
    }
  };

  return (
    // The main container is a self-contained unit with a dark background and rounded shape.
    <div className="relative flex items-center w-48 h-10 bg-[#3a3a3a] rounded-full">
      {/* The actual number input field. */}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        // Styling updates:
        // - `pl-4` and `pr-12` add padding inside the input.
        // - `text-left` aligns the number to the left.
        // - The new CSS classes `hide-arrows` are defined in the <style> tag below.
        className="w-full h-full bg-transparent pl-4 pr-12 text-left text-white font-semibold appearance-none focus:outline-none hide-arrows"
        style={{ MozAppearance: 'textfield' }}
      />
      
      {/* Container for the custom up/down arrow buttons, styled as a "pill" */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#4f4f4f] rounded-full flex flex-col items-center justify-center overflow-hidden">
        {/* Up Arrow Button */}
        <button 
          onClick={handleIncrement} 
          className="h-1/2 w-full text-gray-300 hover:text-white hover:bg-gray-600 transition-colors flex items-center justify-center"
          aria-label="Increment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l-12 16h24z"/></svg>
        </button>
        
        {/* A thin divider line between the buttons */}
        <div className="w-4/5 h-[1px] bg-gray-600"></div>

        {/* Down Arrow Button */}
        <button 
          onClick={handleDecrement} 
          className="h-1/2 w-full text-gray-300 hover:text-white hover:bg-gray-600 transition-colors flex items-center justify-center"
          aria-label="Decrement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24l12-18h-24z"/></svg>
        </button>
      </div>

      {/* This style block adds the necessary CSS to hide the default number input arrows
          in Chrome, Safari, and other WebKit-based browsers. */}
      <style>{`
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}