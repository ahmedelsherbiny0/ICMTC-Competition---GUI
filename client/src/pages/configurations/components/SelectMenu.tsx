/**
 * @file SelectMenu.tsx
 * @description A reusable, styled dropdown select component.
 */

import React from 'react';

interface SelectMenuProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function SelectMenu({ options, placeholder, ...props }: SelectMenuProps) {
  return (
    <select
      {...props}
      className="bg-[#3a3a3a] border border-gray-600 text-white p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
