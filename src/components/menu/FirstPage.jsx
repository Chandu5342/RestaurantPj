// src/App.jsx
import React from "react";
import { Link } from "react-router-dom";

function FirstPage() {
  return (
    <div className="min-h-screen bg-[hsl(30_25%_98%)] flex items-center justify-center">
      {/* Background pattern container */}
      <div className="w-full h-full flex items-center justify-center bg-[url('/bg-pattern.svg')] bg-center bg-no-repeat">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg px-6 py-8 sm:px-10 sm:py-12 flex flex-col items-center w-full max-w-md mx-4">
          {/* Logo circle */}
          <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center mb-6">
            {/* Simple plate + cutlery icon using Tailwind shapes */}
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center relative">
              <div className="w-8 h-8 border-4 border-red-600 rounded-full" />
              <div className="absolute left-3 flex flex-col space-y-1">
                <span className="w-1 h-5 bg-red-600 rounded-full" />
                <span className="w-1 h-4 bg-red-600 rounded-full" />
              </div>
              <div className="absolute right-3 w-1 h-8 bg-red-600 rounded-full" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            The Writers Room
          </h1>

          {/* Button */}
            <Link to="/menu">
          <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors">
            <span>Order Now</span>
            <span className="text-lg">→</span>
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FirstPage;
