import React from "react";
import { FaSpinner } from "react-icons/fa";

const colorVariants = {
  primary: "bg-[#70C544] text-white hover:bg-[#A8E392]",
  info: "bg-blue-500 hover:bg-blue-700 text-white",
  secondary: "bg-gray-500 hover:bg-gray-700 text-white",
  success: "bg-green-500 hover:bg-green-700 text-white",
  danger: "bg-red-500 hover:bg-red-700 text-white",
};

const sizeVariants = {
  small: "px-2 py-1 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
  full: "w-full px-4 py-2 text-base",
};

const Button = ({
  onClick,
  title,
  color = "primary",
  size = "medium",
  icon: Icon, 
  loading = false, 
}) => {
  const colorClass = colorVariants[color] || colorVariants.primary;
  const sizeClass = sizeVariants[size] || sizeVariants.medium;

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`rounded focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 ${colorClass} ${sizeClass}`}
    >
      {loading ? ( 
        <FaSpinner className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon />}
          {title}
        </>
      )}
    </button>
  );
};

export default Button;