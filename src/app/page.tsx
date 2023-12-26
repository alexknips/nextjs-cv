"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
const XTermComponent = dynamic(() => import("../components/XTermComponent"), {
  ssr: false,
});

const TerminalPage: React.FC = () => {
  const [isXTermLoaded, setIsXTermLoaded] = useState(false);

  useEffect(() => {
    setIsXTermLoaded(true);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">Header Content</header>
      <div className="flex flex-grow justify-center items-center">
        <div className="terminal-container w-500px bg-black bg-opacity-50 h-full p-4">
          {isXTermLoaded && <XTermComponent/>}
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;
