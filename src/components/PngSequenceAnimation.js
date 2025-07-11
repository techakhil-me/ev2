'use client';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect, useRef } from 'react';

const PngSequenceAnimation = ({ 
  totalFrames = 38, 
  className = '', 
  srcPrefix = '/ezgif-frame-',
  scrollContainer = null,
  startTrigger = 0, // 0 = start immediately, 0.5 = start at 50% scroll
  endTrigger = 1, // 1 = end at 100% scroll
  id = 'default' // unique identifier for this animation
}) => {
  const containerRef = useRef(null);
  const { currentFrame, imagesLoaded } = useScrollAnimation(
    totalFrames, 
    srcPrefix, 
    1, 
    scrollContainer, 
    startTrigger, 
    endTrigger
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  
  const getImageSrc = (frameNumber) => {
    console.log(`Loading frame ${frameNumber} for ${id}`);
    return `${srcPrefix}${frameNumber}.png`;
  };

  // Handle mouse movement with throttling for performance - attach to window instead of container
  useEffect(() => {
    let ticking = false;
    
    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Use window dimensions instead of container
          const x = ((e.clientX / window.innerWidth) - 0.5) * 2; // -1 to 1
          const y = ((e.clientY / window.innerHeight) - 0.5) * 2; // -1 to 1
          setMousePosition({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Reset position when mouse leaves window
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    // Attach to window instead of container
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Calculate parallax transform values
  const getParallaxStyle = () => {
    const maxMovement = 8;
    const rotationIntensity = 0.5;
    
    const translateX = mousePosition.x * maxMovement;
    const translateY = mousePosition.y * maxMovement;
    const rotateX = -mousePosition.y * rotationIntensity;
    const rotateY = mousePosition.x * rotationIntensity;
    
    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.005)`,
      transition: 'transform 0.15s ease-out',
      transformStyle: 'preserve-3d',
    };
  };

  if (!imagesLoaded) {
    return (
      <div className={`fixed inset-0 w-full h-full bg-black flex items-center justify-center ${className}`}>
        <div className="text-white text-lg animate-pulse">Loading {id} animation...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`} 
      style={{ perspective: '1000px' }}
    >
      <div 
        ref={imageRef}
        style={{
          ...getParallaxStyle(),
          width: '105%',
          height: '105%',
          position: 'absolute',
          top: '-2.5%',
          left: '-2.5%',
          willChange: 'transform'
        }}
      >
        <img
          src={getImageSrc(currentFrame)}
          alt={`${id} animation frame ${currentFrame}`}
          className="w-full h-full object-cover"
          style={{ 
            zIndex: 10,
            backfaceVisibility: 'hidden'
          }}
        />
      </div>
    </div>
  );
};

export default PngSequenceAnimation;