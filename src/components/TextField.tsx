import React from "react";

const TextField: React.FC<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ type, name, placeholder, value, onChange, required }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required || false}
      value={value}
      onChange={onChange}
      className="outline-none p-2 bg-gray-100 rounded-sm transition duration-300 hover:bg-gray-200 focus-within:bg-gray-200"
    />
  );
};

export default TextField;
