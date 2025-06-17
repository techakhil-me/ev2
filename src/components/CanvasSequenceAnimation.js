'use client';
import { useCanvasScrollAnimation } from '../hooks/useCanvasScrollAnimation';
import { useState, useEffect, useRef } from 'react';

const CanvasSequenceAnimation = ({ 
  totalFrames = 148, 
  className = '', 
  srcPrefix = 'https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/',
  startTrigger = 0,
  endTrigger = 1,
  id = 'default',
  originalWidth = 1158,
  originalHeight = 770
}) => {
  const containerRef = useRef(null);
  const { currentFrame, imagesLoaded, canvasRef, canvasDimensions } = useCanvasScrollAnimation(
    totalFrames, 
    srcPrefix, 
    1, 
    startTrigger, 
    endTrigger,
    originalWidth,
    originalHeight
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = [
    "Excavating emerald deposit",
    "Cutting precious stones",
    "Polishing emerald facets",
    "Inspecting gem clarity",
    "Setting emeralds in place",
    "Crafting the final piece"
  ];

  // Loading text rotation effect
  useEffect(() => {
    if (!imagesLoaded) {
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [imagesLoaded, loadingTexts.length]);

  // Handle mouse movement with throttling for performance
  useEffect(() => {
    let ticking = false;
    
    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = ((e.clientX / window.innerWidth) - 0.5) * 2;
          const y = ((e.clientY / window.innerHeight) - 0.5) * 2;
          setMousePosition({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

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
      transform: `translate(-50%, -50%) translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.005)`,
      transition: 'transform 0.15s ease-out',
      transformStyle: 'preserve-3d',
    };
  };

  if (!imagesLoaded) {
    return (
      <div className={`fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center ${className}`}>
        <div className="w-64 h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
          />
        </div>
        <div className="text-emerald-400 text-sm animate-pulse">
          {loadingTexts[loadingTextIndex]}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`} 
      style={{ perspective: '1000px' }}
    >
      <canvas
        ref={canvasRef}
        id={`canvas-${id}`}
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          width: `${canvasDimensions.width}px`,
          height: `${canvasDimensions.height}px`,
          zIndex: 10,
          backfaceVisibility: 'hidden',
          willChange: 'transform',
          ...getParallaxStyle()
        }}
      />
    </div>
  );
};  

export default CanvasSequenceAnimation;