import React from 'react';

const ChatHeader = () => {
  return (
    <div className="relative w-full bg-gradient-to-b from-purple-600/10 via-purple-600/5 to-transparent px-6 py-4 backdrop-blur-sm">
      {/* Back button */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80"
      >
        <svg 
          className="h-6 w-6" 
          fill="none" 
          strokeWidth="2" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Content container */}
      <div className="flex flex-col items-center gap-1">
        {/* Artist name */}
        <h1 className="text-3xl font-bold text-white">Billie Eilish</h1>
        
        {/* Date */}
        <p className="text-sm text-gray-200">Wed Nov 6</p>
        
        {/* Location info */}
        <div className="mt-2 flex flex-col items-center gap-1">
          <p className="text-lg font-medium text-white">Stanford, CA</p>
          <p className="text-sm text-gray-200">
            Frost Amphitheater · 7 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;