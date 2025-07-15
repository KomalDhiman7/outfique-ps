
import React, { useState, useEffect } from 'react';

const loadingCaptions = [
  "Styling like you're about to meet your enemy",
  "Smoothing out the seams…",
  "Mixing the moodboard just right",
  "Threading your perfect look…",
  "Curating your fashion moment…",
  "Weaving some magic…",
  "Tailoring your style story…",
  "Blending colors and dreams…"
];

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "" }) => {
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const randomCaption = loadingCaptions[Math.floor(Math.random() * loadingCaptions.length)];
    setCaption(randomCaption);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground italic animate-pulse">{caption}</p>
    </div>
  );
};

export default LoadingSpinner;
