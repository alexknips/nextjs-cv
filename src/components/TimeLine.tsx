import React, { useEffect, useRef } from "react";
import {
  motion,
  useViewportScroll,
  useTransform,
  useScroll,
  MotionValue,
  useAnimation,
  useSpring,
  useInView,
  MotionProps,
} from "framer-motion";
interface TimelineEventProps {
  date: string;
  title: string;
  content: string;
  index: number;
}

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}


const TimelineEvent: React.FC<TimelineEventProps> = ({
  date,
  title,
  content,
  index,
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref)
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
      ref={ref}
      style={{
        scrollSnapType: "center",
      }}
      animate={controls}
      initial="hidden"
       variants={variants}
       transition={{ type: "spring", duration: 1.0, bounce: 0.2 }}
      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="10"
        >
          {/* <path fill-rule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" /> */}
        </svg>
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <div className="font-bold text-slate-900">{title}</div>
          <time className="font-caveat font-medium text-indigo-500">
            {date}
          </time>
        </div>
        <div className="text-slate-500">{content}</div>
      </div>
    </motion.div>
  );
};

interface Event {
  date: string;
  title: string;
  content: string;
}

interface TimelineProps {
  events: Event[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {events.map((event, index) => (
        <TimelineEvent key={index} index={index} {...event} />
      ))}
    </div>
  );
};

export default Timeline;
