import React from 'react';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="group fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg
        shadow-sm hover:shadow-md transition-all duration-300 ease-in-out
        border border-blue-100 hover:border-blue-200 hover:bg-blue-100
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Go back"
    >
      <ArrowLeft 
        className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
      />
      <span className="font-medium">Back</span>
    </button>
  );
};

export default BackButton;