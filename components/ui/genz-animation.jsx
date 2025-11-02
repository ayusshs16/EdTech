'use client';

import { motion } from 'framer-motion';

const GenZAnimation = ({ children, className = '' }) => {
  // Animation: Fade-in on load, and a clear "pop" effect on hover with a white background.
  const containerVariants = {
    // Defines the "pop" effect for hover
    hover: { 
      scale: 1.05, 
      boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 0 3px rgba(255, 255, 255, 0.8)', // Stronger shadow and a subtle white border/glow
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }, // Maintains a slight tap down effect
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl p-6 cursor-pointer bg-white text-black ${className}`} // Set background to white and ensure default text color is black
      // Initial fade-in animation
      initial={{ opacity: 0, y: 20, scale: 0.98, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}

      // Apply interactive animations
      whileHover="hover"
      whileTap="tap"
      variants={containerVariants}
      // Removed inline style for background as it's now handled by className bg-white
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GenZAnimation;
