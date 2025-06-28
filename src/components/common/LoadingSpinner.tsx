import React from 'react';
import { motion } from 'framer-motion';

const fashionCaptions = [
  "Styling like you're about to meet your enemy",
  "Smoothing out the seams…",
  "Mixing the moodboard just right",
  "Curating your perfect look",
  "Adding the finishing touches",
  "Coordinating colors and patterns",
  "Finding your fashion flow",
  "Elevating your style game",
  "Weaving fashion magic",
  "Polishing your perfect ensemble"
];

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  showCaption?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  showCaption = true 
}) => {
  const randomCaption = fashionCaptions[Math.floor(Math.random() * fashionCaptions.length)];
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {showCaption && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 dark:text-gray-300 font-medium italic"
        >
          {randomCaption}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;