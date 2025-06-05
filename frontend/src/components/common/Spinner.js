import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Spinner = ({ size = 'medium', text = '' }) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size] || 'w-8 h-8';

  return (
    <div className="flex flex-col items-center justify-center">
      <FaSpinner className={`${sizeClass} text-blue-600 animate-spin`} />
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};

export default Spinner;
