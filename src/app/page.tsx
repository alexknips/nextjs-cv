"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import Timeline from "@/components/TimeLine";
import { employmentNewestFirst } from "./data/employment";
import { educationNewestFirst } from "./data/education";
import { Show } from "./models";
const XTermComponent = dynamic(() => import("../components/XTermComponent"), {
  ssr: false,
});

const TerminalPage: React.FC = () => {
  const [isXTermLoaded, setIsXTermLoaded] = useState(false);
  const [showEmployment, setShowEmployment] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    setIsXTermLoaded(true);

    const handleEscape = (event: { key: string }) => {
      if (event.key === "Escape") {
        setShowEmployment(false);
        setShowEducation(false);
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleEscape);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const showOrHideVisuals = (show: Show, visible: boolean) => {
    switch (show) {
      case Show.Education:
        setShowEducation(visible);
        break;
      case Show.Employment:
        setShowEmployment(visible);
        break;
      case Show.All:
        setShowEmployment(false);
        setShowEducation(false);
        break;
    }
  };

  const handleProgressChanged = (inProgress: boolean) => {
    setInProgress(inProgress);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.target is now correctly typed as EventTarget
    const target = e.target as HTMLElement; // Type assertion
    console.log(target.id)

    // Check if the click is outside the content area
    if (target.id === 'overlay' || target.id === 'overlay-content') {
      showOrHideVisuals(Show.All, false);
      console.log("closing")
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-customBlack flex flex-col items-center justify-center h-24">
        <h1 className="text-4xl font-bold font-mono text-gray-200">
          Alexander Knips
        </h1>
        <p className="text-xl text-gray-600 font-mono mt-2">
          Terminal based resume with GPT interaction
        </p>
      </header>
      <div className="flex flex-grow justify-center items-center bg-customBlack">
        <div className="terminal-container w-4/6 bg-customBlack h-full p-4">
          {showEmployment && (
            <div id="overlay" onClick={handleOutsideClick}>
              <div id="overlay-content" onClick={handleOutsideClick}>
                <Timeline events={employmentNewestFirst.reverse()} closeVisuals={function (): void {
                 showOrHideVisuals(Show.All, false);
                } } />
              </div>
            </div>
          )}
          {showEducation && (
            <div id="overlay" onClick={handleOutsideClick}>
              <div id="overlay-content" onClick={handleOutsideClick}>
                 <Timeline events={educationNewestFirst.reverse()} closeVisuals={function (): void {
                 showOrHideVisuals(Show.All, false);
                } } />
              </div>
            </div>
          )}

          {isXTermLoaded && (
            <div
              className={`h-full w-full transition-opacity duration-500 ${
                showEmployment || showEducation || inProgress
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              <XTermComponent
                showOrHideVisuals={showOrHideVisuals}
                onProgressChanged={handleProgressChanged}
              />
            </div>
          )}

          {inProgress && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <div className="animate-pulse relative items-center block max-w-sm p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white opacity-100">
                  Loading AI response...
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 opacity-100">
                  Also try the commands:{" "}
                  <span className="font-semibold ...">employment</span>,{" "}
                  <span className="font-semibold ...">education</span>, or{" "}
                  <span className="font-semibold ...">help</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="bg-customBlack text-center p-4 text-gray-600">
      <p>© Alexander Knips</p>
      {/* <p>
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> | 
        <a href="#" className="text-blue-600 hover:underline">Terms of Use</a>
      </p> */}
    </footer>
    </div>
  );
};

export default TerminalPage;
