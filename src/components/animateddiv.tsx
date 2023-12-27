import { motion } from "framer-motion";
// import CardTopImage from "/img/next.svg";

interface AnimatedDivProps {
  hide: () => void;
}
const AnimatedDiv: React.FC<AnimatedDivProps> = ({ hide }) => {
  return (
    <motion.div
      className="max-w-sm rounded overflow-hidden shadow-lg relative bg-gray-800"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.8,
        ease: "easeInOut" }}
      style={{
        zIndex: 100,
      }}
    >
      <div className="flex justify-between items-center p-4">
        <h2 className="text-md font-bold">Example Title</h2>
        <button className="text-xl font-bold" onClick={hide}>&times;</button>
      </div>

      <img
        className="w-full"
        src="https://picsum.photos/800/400"
        alt="Sunset in the mountains"
      />

      <div className="px-6 py-4">
        <p className="text-gray-200 text-base">Some more content here</p>
      </div>
    </motion.div>
  );
};

export default AnimatedDiv;
