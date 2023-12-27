"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import AnimatedDiv from "../components/animateddiv";
import Timeline from "@/components/TimeLine";
const XTermComponent = dynamic(() => import("../components/XTermComponent"), {
  ssr: false,
});

const TerminalPage: React.FC = () => {
  const [isXTermLoaded, setIsXTermLoaded] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [showTimeline, setshowTimeline] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    setIsXTermLoaded(true);
  }, []);

  const handleCustomFunction = (show: boolean | undefined) => {
    console.log("Custom function called from XTermComponent");
    // if (show !== undefined) setShowDiv(show);
    // else setShowDiv(true);

    if (show !== undefined) setshowTimeline(show);
    else setshowTimeline(true);
  };

  const handleProgressChanged = (inProgress: boolean) => {
    setInProgress(inProgress);
  };

  const eventsBackwards = [
    {
      date: "September 2023",
      title: "Karius, Inc, Senior Staff Software engineer - Technical Lead",
      content:
        "After a brief period of being unable to work due to visa issues, Alexander got his greencard in September 2023 and was able to work again. From hereon until now he was employed at Karius, Inc. as a Senior Staff Software Engineer and was now a fully technical lead. He has been leading multiple engineers on the rewrite of the LIMS automations from Scala to Typescript. Further, leading another contractor to implement a micro-service for fulfillment tracking.",
    },
    { date: "April 2023", title: "Visa related break", content: "..." },
    {
      date: "October 2021",
      title: "Karius, Senior Staff Software engineer - Backend",
      content:
        "Continued development of the software platform and the overall order fulfillment (Csharp, Scala, Typescript). Architectural assessment, redesign and presentations regarding Kafka and Event-Driven-Design. Team specific introduction of using Typescript on the backend with NestJS. Engineering wide: Introduced C4 Model, Opentelemetry, Kustomize (K8s), and Kafka.",
    },
    {
      date: "date",
      title: "Toptal/Contractor - Client: Karius - kariusdx.com",
      content: "Content for event 3",
    },
    {
      date: "date",
      title: "Freelance - Client: joe.systems",
      content: "Content for event 4",
    },
    {
      date: "date",
      title: "Own Startup: Lagerly",
      content: "Content for event 4",
    },
    { date: "date", title: "PhD - Physics", content: "Content for event 4" },
    {
      date: "date",
      title: "Software engineer & Customer care - Fullstack",
      content: "Content for event 4",
    },

    // ... more events
  ];

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 flex flex-col items-center justify-center h-24">
        <h1 className="text-4xl font-bold text-gray-200">Alexander Knips</h1>
        <p className="text-xl text-gray-600 mt-2">
          Terminal based resumee with GPT interaction
        </p>
      </header>
      <div className="flex flex-grow justify-center items-center bg-customBlack">
        <div className="terminal-container w-4/6 bg-customBlack h-full p-4">
          {showDiv && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <AnimatedDiv hide={() => setShowDiv(false)} />
            </div>
          )}
          {showTimeline && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <div className="w-5/6">
                <Timeline events={eventsBackwards.reverse()} />
              </div>
            </div>
          )}

          {isXTermLoaded && (
            <div
              className={`transition-opacity duration-500 ${
                showTimeline || inProgress ? "opacity-50" : "opacity-100"
              }`}
            >
              <XTermComponent
                onCustomFunction={handleCustomFunction}
                onProgressChanged={handleProgressChanged}
              />
            </div>
          )}

          {inProgress && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            
                <div className="animate-pulse relative items-center block max-w-sm p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white opacity-100">
                        Loading...
                      </h5>
                      <p className="font-normal text-gray-700 dark:text-gray-400 opacity-100">
                        Also try the commands: <span className="font-semibold ...">timeline</span>,  <span className="font-semibold ...">education</span>, or  <span className="font-semibold ...">help</span>
                      </p>
                    </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;
