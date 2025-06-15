'use client';
import { useState, useEffect } from 'react';

export const useScrollAnimation = (
  totalFrames, 
  srcPrefix, 
  scrollMultiplier = 1, 
  containerRef = null, 
  startTrigger = 0, 
  endTrigger = 1
) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all images
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = [];
      
      for (let i = 1; i <= totalFrames; i++) {
        const imageSrc = `${srcPrefix}${i}.png`;
        
        const imagePromise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageSrc;
        });
        
        imagePromises.push(imagePromise);
      }
      
      Promise.all(imagePromises)
        .then(() => {
          setImagesLoaded(true);
        })
        .catch((error) => {
          console.error('Error preloading images:', error);
          setImagesLoaded(true);
        });
    };

    preloadImages();
  }, [totalFrames, srcPrefix]);

  useEffect(() => {
    if (!imagesLoaded) return;

    const handleScroll = () => {
      let scrollTop, maxScrollTop;
      
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      maxScrollTop = document.body.scrollHeight - window.innerHeight;
      
      if (maxScrollTop <= 0) return;
      
      const scrollFraction = scrollTop / maxScrollTop;
      
      // Calculate the animation progress based on start and end triggers
      let animationProgress = 0;
      
      if (scrollFraction <= startTrigger) {
        animationProgress = 0;
      } else if (scrollFraction >= endTrigger) {
        animationProgress = 1;
      } else {
        // Map the scroll fraction between start and end triggers to 0-1
        const triggerRange = endTrigger - startTrigger;
        const adjustedProgress = (scrollFraction - startTrigger) / triggerRange;
        animationProgress = Math.max(0, Math.min(1, adjustedProgress));
      }
      
      const frameIndex = Math.min(
        totalFrames,
        Math.max(1, Math.ceil(animationProgress * totalFrames * scrollMultiplier))
      );
      
      setCurrentFrame(frameIndex);
    };

    // Add initial call to set correct frame on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalFrames, scrollMultiplier, imagesLoaded, startTrigger, endTrigger]);

  return { currentFrame, imagesLoaded };
};