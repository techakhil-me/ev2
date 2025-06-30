"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  const [soundOn, setSoundOn] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isLastSection, setIsLastSection] = useState(false);
  const audioRef = useRef(null);

  const toggleSound = () => {
    const newSoundState = !soundOn;
    setSoundOn(newSoundState);

    if (audioRef.current) {
      if (newSoundState) {
        audioRef.current.play().catch((error) => {
          console.log("Background music play failed:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  const initializeAudio = () => {
    if (audioRef.current && !audioInitialized && soundOn) {
      // Set volume
      audioRef.current.volume = 0.3; // Background music at 30%
      
      // Play audio track
      audioRef.current.play().catch((error) => {
        console.log("Background music play failed:", error);
        setSoundOn(false);
      });
      
      setAudioInitialized(true);
    }
  };

  // Monitor scroll position to detect last section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're near the bottom of the page (within 100px)
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;
      setIsLastSection(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Add click listener to start audio on first user interaction
    const handleFirstClick = () => {
      initializeAudio();
      // Remove the listener after first click
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [audioInitialized, soundOn]);

  return (
    <>
      {/* Background Music Audio element */}
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src="/music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <motion.footer
        className="fixed bottom-0 left-0 w-full p-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSound}
              className={`flex items-center text-sm text-white/80 hover:text-white transition-colors ${
                soundOn ? "opacity-100" : "opacity-50"
              }`}
              aria-label={soundOn ? "Sound on" : "Sound off"}
            >
              <div className="flex space-x-0.5 mr-2">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 h-4 bg-white rounded-full transition-all duration-300 ${
                      soundOn ? "animate-pulse" : ""
                    }`}
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      height: soundOn ? `${12 + i * 3}px` : "12px",
                    }}
                  ></div>
                ))}
              </div>
              <span className="text-white/80">Sound</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isLastSection ? (
              <a 
                href="https://embrant.com/embrant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <div className="overflow-hidden relative px-4 py-2">
                  <motion.div 
                    className="flex items-center space-x-1"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <span>Back to main page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="inline-block ml-1 transition-transform duration-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </motion.div>
                </div>
              </a>
            ) : (
              <div className="text-sm text-white/80 cursor-default">
                <div className="overflow-hidden relative px-4 py-2">
                  <div className="flex items-center space-x-1">
                    <span>scroll to explore</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="inline-block ml-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;