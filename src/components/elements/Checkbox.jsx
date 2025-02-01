import React from 'react';

const Checkbox = ({ label, checked, onChange, disabled = false }) => {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            {label && <label className="ml-2 text-gray-700">{label}</label>}
        </div>
    );
};

export default Checkbox;