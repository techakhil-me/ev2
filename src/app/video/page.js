'use client';
import { useEffect, useRef } from "react";

function ScrollSequence() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Number of images to be sequenced
    const frameCount = 76;

    // Function to generate the filename of the image based on the current index
    const currentFrame = (index) => {
      return `/scene1/ezgif-frame-${(index)
        .toString()
        .padStart(3, "0")}.png`;
    };

    // Drawing the initial images on the canvas
    const img = new Image();
    img.src = currentFrame();
    img.onload = function () {
      const x = (canvas.width - img.width) / 2;
      const y = (canvas.height - img.height) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width, img.height);
    };

    // Preloading images 
    const preloadImages = () => {
      Array.from({ length: frameCount }, (_, i) => {
        const img = new Image();
        img.src = currentFrame(i + 1);
      });
    };

    // Update images
    const updateImage = (index) => {
      img.src = currentFrame(index);
      img.onload = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

    // Tracking the user scroll position
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const maxScrollTop = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      requestAnimationFrame(() => updateImage(frameIndex + 1));
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redraw current frame after resize
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    preloadImages();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="png__sequence">
      <canvas 
        ref={canvasRef} 
        className="png__sequence__canvas fixed inset-0 w-full h-full" 
        style={{ zIndex: -1 }}
        id="canvas"
      /> 
    </div>
  );
}

export default function VideoPage() {
  return (
    <>
      <ScrollSequence />
      
      <main className="relative z-10 min-h-[500vh]">
        
      </main>
    </>
  );
}