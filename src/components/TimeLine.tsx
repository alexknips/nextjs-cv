import React, { useRef } from "react";
import { motion, useViewportScroll, useTransform, useScroll, MotionValue } from 'framer-motion';

interface TimelineEventProps {
  date: string;
  title: string;
  content: string;
  index: number;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  date,
  title,
  content,
  index,
}) => {
  // Animation variants
  const variants = {
    visible: { opacity: 1, translateX: 0 },
    hiddenEven: { opacity: 0, translateX: 300 }, // Different offset for even items
    hiddenOdd: { opacity: 0, translateX: -300 }, // Different offset for odd items
  };

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  // const y = useParallax(scrollYProgress, 300);

  return (
    // <motion.div
    
    // animate="visible"
    // >

 
    <motion.div
      key={index}
    variants={variants}
      
      // style={{ scale: scrollYProgress }}
      className="mt-10 relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
      // initial={index % 2 === 0 ? "hiddenEven" : "hiddenOdd"}
     
    
      // transition={{ duration: 1.0, delay: index * 2.0 }}
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.25rem)] bg-slate-200 p-4 rounded border border-slate-200 shadow">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <div className="font-bold text-slate-900">{title}</div>
          <time className="font-caveat font-medium text-indigo-700">
            {date}
          </time>
        </div>
        <div className="text-slate-900 text-sm">{content}</div>
      </div>
    </motion.div>
    // </motion.div>
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
  const { scrollYProgress } = useScroll();
  return (
     
<motion.div
 style={{
  zIndex: 100,
}}
className="overflow-auto relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent"
>
{events.map((event, index) => (
  <TimelineEvent key={index} index={index} {...event} />
))}
</motion.div>
  );
};

export default Timeline;
function useParallax(scrollYProgress: MotionValue<number>, arg1: number) {
  throw new Error("Function not implemented.");
}
