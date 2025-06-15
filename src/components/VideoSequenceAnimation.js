'use client';
import { useRef, useEffect, useState } from 'react';

const VideoSequenceAnimation = ({ videoSrc, className = '' }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleScroll = () => {
      if (!video || video.duration === 0) return;

      const scrollTop = window.pageYOffset;
      const maxScrollTop = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      
      // Set video time based on scroll position
      const targetTime = scrollFraction * video.duration;
      video.currentTime = targetTime;
    };

    video.addEventListener('loadeddata', handleLoadedData);
    window.addEventListener('scroll', handleScroll);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className={`fixed inset-0 w-full h-full bg-black flex items-center justify-center ${className}`}>
        <div className="text-white text-lg animate-pulse">Loading video...</div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 w-full h-full ${className}`}>
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        style={{ zIndex: -1 }}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
};

export default VideoSequenceAnimation;