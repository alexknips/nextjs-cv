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

    const handleEscape = (event: { key: string }) => {
      if (event.key === "Escape") {
        setshowTimeline(false);
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleEscape);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
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
        "Back after awaiting a Greencard, leading multiple engineers on the rewrite of the LIMS automations from Scala to Typescript. Leading another contractor to implement a micro-service for fulfillment tracking. Mentoring other engineers in the implementation of event driven architecture.",
    },
    {
      date: "April 2023",
      title: "Visa related break.",
      content: "Greencard obtained in September 2023.",
    },
    {
      date: "October 2021",
      title: "Karius, Senior Staff Software engineer - Backend",
      content:
        "Continued development of the software platform and the overall order fulfillment (C#, Scala, Typescript). Architectural assessment, redesign and presentations regarding Kafka and Event-Driven-Design. Team specific introduction of using Typescript on the backend with NestJS. Engineering wide: Introduced C4 Model, Opentelemetry, Kustomize (K8s), GraphQL and Kafka.",
    },
    {
      date: "August 2016",
      title: "Toptal/Contractor - Client: Karius - kariusdx.com",
      content:
        "As a senior software engineer at Karius, I led the development of internal and customer-facing portals using ASP.NET Core in C#. Additionally, I contributed to the in-house LIMS system's development in Scala and collaborated on components and APIs with the Illumina LIMS system, using Scala and Python. Played a key role in planning and executing a back-end rewrite using domain-driven design principles in Scala. Introduced end-to-end testing platforms (Cypress) alongside existing unit and API tests. Operational maintenact of software in life-critical environment. DevOps usage and improvements using kustomize.",
    },
    {
      date: "January 2016",
      title: "Freelance - Client: joe.systems",
      content:
        "Development of customs-related software. API development with Python and Django REST Framework. DSL/Rule parsing with Parser Combinators such as PyParse. Development, requirement engineering, architecture and technical design.",
    },
    {
      date: "January 2015",
      title: "Own Startup: Lagerly",
      content:
        "Building and funding (EXIST) a startup around computer vision and object recognition in retail, under supervision and guidance by UnternehmerTUM. Prototypes developed using C#, Python, Cloud, OpenCV, GPUs, machine learning, and neural networks.",
    },
    {
      date: "Feburary 2012",
      title: "PhD - Physics",
      content:
        "Employment as teaching assistant: Supervision of tutorials and internships",
    },
    {
      date: "September 2007",
      title: "Software engineer & Customer care - Fullstack",
      content:
        "Specific responsibilities: Development of enterprise resource planning (ERP) software on Windows using .Net and SQL database, additional projects for web, cloud and mobile supporting the ERP solution. Large code-base in C# but parts of the system were also written in C++. SQL Reporting and extensive Reporting capabilities.",
    },
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
            <div id="overlay">
              <div id="overlay-content">
                <Timeline events={eventsBackwards.reverse()} />
              </div>
            </div>
          )}

          {isXTermLoaded && (
            <div
              className={`h-full w-full transition-opacity duration-500 ${
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
                  Also try the commands:{" "}
                  <span className="font-semibold ...">timeline</span>,{" "}
                  <span className="font-semibold ...">education</span>, or{" "}
                  <span className="font-semibold ...">help</span>
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
