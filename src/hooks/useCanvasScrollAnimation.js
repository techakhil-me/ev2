'use client';
import { useState, useEffect, useRef } from 'react';

export const useCanvasScrollAnimation = (
  totalFrames, 
  srcPrefix, 
  scrollMultiplier = 1, 
  startTrigger = 0, 
  endTrigger = 1,
  originalWidth = 1158,
  originalHeight = 770
) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(true);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: originalWidth, height: originalHeight });
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const imagesRef = useRef({});

  // Calculate canvas dimensions based on viewport with mobile-first approach
  useEffect(() => {
    const updateCanvasDimensions = () => {
      const isMobile = window.innerWidth <= 768;
      
      let viewportHeight, viewportWidth;
      
      if (isMobile) {
        // Use large viewport height for mobile to avoid address bar issues
        viewportHeight = window.innerHeight;
        // Try to get the actual viewport height without address bar
        if (CSS.supports('height', '100lvh')) {
          const testElement = document.createElement('div');
          testElement.style.height = '100lvh';
          testElement.style.position = 'fixed';
          testElement.style.top = '0';
          testElement.style.visibility = 'hidden';
          document.body.appendChild(testElement);
          viewportHeight = testElement.offsetHeight;
          document.body.removeChild(testElement);
        }
        viewportWidth = window.innerWidth;
      } else {
        viewportHeight = window.innerHeight;
        viewportWidth = window.innerWidth;
      }
      
      const aspectRatio = 3840 / 2160; // 16:9 aspect ratio
      
      // Calculate dimensions based on both width and height constraints
      const heightBasedWidth = viewportHeight * aspectRatio;
      const widthBasedHeight = viewportWidth / aspectRatio;
      
      // Use the larger dimensions to ensure both viewport width and height are covered
      const canvasWidth = Math.max(viewportWidth, heightBasedWidth);
      const canvasHeight = Math.max(viewportHeight, widthBasedHeight);
      
      setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    window.addEventListener('orientationchange', updateCanvasDimensions);
    
    // Additional listener for mobile viewport changes
    const handleViewportChange = () => {
      setTimeout(updateCanvasDimensions, 100);
    };
    
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
      window.removeEventListener('orientationchange', updateCanvasDimensions);
      window.removeEventListener('scroll', handleViewportChange);
    };
  }, [originalWidth, originalHeight]);

  // Preload all images
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = [];
      
      for (let i = 1; i <= totalFrames; i++) {
        const imageSrc = `${srcPrefix}${i}.png`;
        
        const imagePromise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            imagesRef.current[i] = img;
            resolve();
          };
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

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    // Set canvas display size
    canvas.style.width = `${canvasDimensions.width}px`;
    canvas.style.height = `${canvasDimensions.height}px`;
    
    // Set canvas internal resolution (for crisp rendering)
    const scale = window.devicePixelRatio || 1;
    canvas.width = canvasDimensions.width * scale;
    canvas.height = canvasDimensions.height * scale;
    context.scale(scale, scale);

    // Draw initial frame
    if (imagesRef.current[1]) {
      context.drawImage(imagesRef.current[1], 0, 0, canvasDimensions.width, canvasDimensions.height);
    }
  }, [imagesLoaded, canvasDimensions]);

  // Update canvas when frame changes
  useEffect(() => {
    if (!contextRef.current || !imagesRef.current[currentFrame]) return;

    requestAnimationFrame(() => {
      contextRef.current.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
      contextRef.current.drawImage(
        imagesRef.current[currentFrame], 
        0, 0, 
        canvasDimensions.width, 
        canvasDimensions.height
      );
    });
  }, [currentFrame, canvasDimensions]);

  useEffect(() => {
    if (!imagesLoaded) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const maxScrollTop = document.body.scrollHeight - window.innerHeight;
      
      if (maxScrollTop <= 0) return;
      
      const scrollFraction = scrollTop / maxScrollTop;
      
      // Calculate the animation progress based on start and end triggers
      let animationProgress = 0;
      
      if (scrollFraction <= startTrigger) {
        animationProgress = 0;
      } else if (scrollFraction >= endTrigger) {
        animationProgress = 1;
      } else {
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

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalFrames, scrollMultiplier, imagesLoaded, startTrigger, endTrigger]);

  return { currentFrame, imagesLoaded, canvasRef, canvasDimensions };
};