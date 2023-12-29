import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { TimelineEvent } from "../app/data/event.model";

interface TimelineEventProps {
  dateFrom: string;
  dateTo: string;
  title: string;
  content: string;
  location: string;
  index: number;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  dateFrom,
  dateTo,
  title,
  content,
  location,
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (inView) {
      controls.start("visible");
      controls.start("scaleFull");
    } else {
      controls.start("hidden");
      controls.start("scaleLow");
    }
  }, [controls, inView]);

  const variants = {
    scaleLow: { scale: 0.2 },
    scaleFull: { scale: 1.0 },
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
    id="timelineElement"
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      transition={{ type: "spring", duration: 1.0, bounce: 0.2 }}
      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />

      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.25rem)] bg-white p-4 rounded border border-slate-200 shadow">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <div className="font-bold text-slate-900">{title}</div>
          <time className="font-caveat font-medium text-indigo-500">
            <span>{dateFrom}</span> - <span>{dateTo}</span>
          </time>
        </div>
        <div className="text-slate-500">{content}</div>
      </div>
    </motion.div>
  );
};

interface TimelineProps {
  events: TimelineEvent[];
  closeVisuals: () => void;
}



const Timeline: React.FC<TimelineProps> = ({ events, closeVisuals }) => {

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.target is now correctly typed as EventTarget
    const target = e.target as HTMLElement; // Type assertion
    console.log("closing: " + target.id)

    // Check if the click is outside the content area
    if (target.id === 'timeline' || target.id === 'timelineElement') {
      closeVisuals();
      console.log("closing")
    }
  };
  return (
    <div 
    id="timeline"
    onClick={handleOutsideClick}
    className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {events.map((event, index) => (
        <TimelineEvent key={index} index={index} {...event} />
      ))}
    </div>
  );
};

export default Timeline;
