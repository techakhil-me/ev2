"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const [soundOn, setSoundOn] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef(null);
  const narrationRef = useRef(null);

  const toggleSound = () => {
    const newSoundState = !soundOn;
    setSoundOn(newSoundState);

    if (audioRef.current && narrationRef.current) {
      if (newSoundState) {
        audioRef.current.play().catch((error) => {
          console.log("Background music play failed:", error);
        });
        narrationRef.current.play().catch((error) => {
          console.log("Narration play failed:", error);
        });
      } else {
        audioRef.current.pause();
        narrationRef.current.pause();
      }
    }
  };

  const initializeAudio = () => {
    if (audioRef.current && narrationRef.current && !audioInitialized && soundOn) {
      // Set volumes
      audioRef.current.volume = 0.3; // Background music at 30%
      narrationRef.current.volume = 0.7; // Narration at 70% for clarity
      
      // Play both audio tracks
      audioRef.current.play().catch((error) => {
        console.log("Background music play failed:", error);
        setSoundOn(false);
      });
      
      narrationRef.current.play().catch((error) => {
        console.log("Narration play failed:", error);
      });
      
      setAudioInitialized(true);
    }
  };

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
        <source src="/ambient-pads.mp3" type="audio/mpeg" />
        <source src="/ambient-pads.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Narration Audio element */}
      <audio ref={narrationRef} loop preload="auto" className="hidden">
        <source src="/narration.mp3" type="audio/mpeg" />
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
            <button className="text-sm text-white/80 hover:text-white transition-colors">
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
            </button>
          </div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;