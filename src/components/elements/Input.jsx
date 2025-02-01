import React from 'react'

const Input = ({ value, setvalue, type = 'text', placeholder, label = null }) => {

  const assingValue = (e) => {
    setvalue(e.target.value)
  }

  return (
    <div>
      {label && <span>{label}</span>}
      <input
        value={value}
        className="w-full mb-3 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#70C544] focus:bg-white"
        type={type}
        onChange={assingValue}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Input