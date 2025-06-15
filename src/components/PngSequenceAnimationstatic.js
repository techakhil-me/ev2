'use client';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const PngSequenceAnimationstatic = ({ totalFrames = 38, className = '' }) => {
  const { currentFrame, imagesLoaded, scrollProgress } = useScrollAnimation(totalFrames);
  
  const getImageSrc = (frameNumber) => {
    // const paddedNumber = frameNumber.toString().padStart(4, '0');
    console.log('Current Frame:', frameNumber);
    return `/scene1/scene1-${frameNumber}.png`;
  };

  if (!imagesLoaded) {
    return (
      <div className={`fixed inset-0 w-full h-full bg-black flex items-center justify-center ${className}`}>
        <div className="text-white text-lg animate-pulse">Loading animation...</div>
      </div>
    );
  }

  return (
    <>
      <div className={`fixed inset-0 w-full h-full ${className}`}>
        <img
          src={getImageSrc(currentFrame)}
          alt={`Animation frame ${currentFrame}`}
          className="w-full h-full object-cover"
          style={{ zIndex: -1 }}
        />
      </div>
    </>
  );
};

export default PngSequenceAnimationstatic;