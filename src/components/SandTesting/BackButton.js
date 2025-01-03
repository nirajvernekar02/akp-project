import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg
        shadow-sm hover:shadow-md transition-all duration-300 ease-in-out
        border border-blue-100 hover:border-blue-200
        transform hover:-translate-x-1
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Go back"
    >
      <ArrowLeft 
        size={20}
        className="transform transition-transform duration-300 group-hover:scale-110"
      />
      <span className="text-sm font-semibold tracking-wide
        relative after:content-[''] after:absolute after:w-full after:h-0.5 
        after:bg-blue-400 after:left-0 after:-bottom-0.5 after:rounded-full
        after:origin-left after:scale-x-0 after:transition-transform
        group-hover:after:scale-x-100"
      >
        Back
      </span>
      
      {/* Hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10" />
    </button>
  );
};

export default BackButton;