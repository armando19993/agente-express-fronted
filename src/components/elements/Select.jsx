import React from 'react';

const Select = ({ value, setvalue, options, placeholder }) => {
  const handleChange = (e) => {
    setvalue(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="w-full mb-3 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#70C544] focus:bg-white"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;