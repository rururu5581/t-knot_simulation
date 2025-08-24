
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center">
        <div className="bg-[#00aeef] p-2 rounded-md mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8l3 5m0 0l3-5m-3 5v4m0 0H9m3 0h3m-3-5a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800">T.knot 家計診断シミュレーター</h1>
      </div>
    </header>
  );
};

export default Header;
