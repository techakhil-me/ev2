'use client';
import CanvasSequenceAnimation from "../components/CanvasSequenceAnimation";
import Footer from "../components/Footer";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax - more subtle
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smooth mouse tracking - reduced responsiveness
  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });
  
  // Transform values for parallax effect - much more subtle
  const rotateX = useTransform(springY, [-0.5, 0.5], [1, -1]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-1, 1]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-3, 3]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-3, 3]);

  // Images for the carousel
  const carouselImages = [
    "/emeralds/emerald-1.png",
    "/emeralds/emerald-2.png",
    "/emeralds/emerald-3.png",
    "/emeralds/emerald-4.png",
    "/emeralds/emerald-5.png"
  ];

  // Emerald green color palette
  const emeraldColors = [
    '#FFFFFF', // Pure white
    '#F8FFF8', // Mint white
    '#F0FFF0', // Honeydew
    '#E6FFE6', // Light mint
    '#D4F4DD', // Pale mint green
    '#C8E6C8'  // Light emerald green
  ];

  // Pixie dust particle creation with emerald colors
  const createParticle = (x, y) => {
    const id = Math.random();
    const particle = {
      id,
      x,
      y,
      initialX: x,
      initialY: y,
      life: 1,
      size: Math.random() * 4 + 1,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      color: emeraldColors[Math.floor(Math.random() * emeraldColors.length)],
      opacity: 1
    };

    setParticles(prev => [...prev.slice(-20), particle]); // Keep only last 20 particles

    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 2000);
  };

  // Global mouse move handler for pixie dust
  useEffect(() => {
    let lastTime = 0;
    
    const handleGlobalMouseMove = (e) => {
      const currentTime = Date.now();
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Throttle particle creation
      if (currentTime - lastTime > 50) {
        createParticle(e.clientX, e.clientY);
        lastTime = currentTime;
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () => document.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Mouse move handler for parallax
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Reset mouse position when leaving
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Monitor scroll to determine which animation should be active
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const section = Math.floor(scrollTop / windowHeight);
      setCurrentSection(section);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel navigation functions
  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => 
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  // Carousel slide variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1
    })
  };

  // Uniform animation settings
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <>
      {/* Emerald Pixie Dust Particles */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: particle.initialX,
              top: particle.initialY,
              boxShadow: `0 0 8px ${particle.color}, 0 0 12px ${particle.color}30`,
            }}
            initial={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [1, 0.8, 0],
              scale: [1, 0.8, 0],
              x: [0, particle.velocity.x * 30, particle.velocity.x * 60],
              y: [0, particle.velocity.y * 30, particle.velocity.y * 60],
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Custom Cursor with Emerald Theme */}
      <motion.div
        className="fixed w-2 h-2 pointer-events-none z-40 mix-blend-screen"
        style={{
          left: mousePosition.x - 4,
          top: mousePosition.y - 4,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-full h-full rounded-full bg-white animate-pulse" />
        <div className="absolute inset-1 rounded-full bg-white" />
        <div className="absolute inset-2 rounded-full bg-white" />
      </motion.div>

      <main className="relative z-10 min-h-[100vh]">
        {/* Canvas Animation - Apple-style with viewport height */}
          <CanvasSequenceAnimation 
            totalFrames={140} 
            srcPrefix="/scene1/scene1-"
            startTrigger={0}
            endTrigger={0.3}
            id="apple-style"
            originalWidth={1158}
            originalHeight={770}
            className={`transition-opacity duration-700 ease-in-out ${currentSection >= 0 && currentSection < 2 ? 'opacity-100' : 'opacity-0'}`}
          />

          <CanvasSequenceAnimation 
            totalFrames={180} 
            srcPrefix="/scene2/scene2-"
            startTrigger={0.3}
            endTrigger={0.9}
            id="apple-style"
            originalWidth={1158}
            originalHeight={770}
            className={`transition-opacity duration-1000 ease-in-out ${currentSection >= 2 && currentSection <= 4 ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* background image */}

          {/* <div className="fixed inset-0 z-[-1]">
          <video 
            autoPlay 
            loop 
            muted 
            className={`w-full h-full object-cover ${currentSection >= 0 && currentSection < 2 ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/herobg.mp4" type="video/mp4" />
          </video>
        </div> */}

        <div className="fixed inset-0 z-[-1]">
          <img 
            src="/scene2bg.png" 
            alt="Background" 
            className={`w-full h-full object-cover scale-[1.015] ${currentSection >= 5  ? 'opacity-100' : 'opacity-0'}`}

          />
        </div>

        {/* Section 1 */}
        <section className="absolute top-0 left-0 w-full h-screen flex items-center justify-center text-white">
          <div className="text-center px-8 pt-64">
            <motion.div
              {...fadeInUp}
              className="mb-16"
            >
              <h1 
                className="text-6xl md:text-8xl font-thin italic mb-4 title"
                style={{
                  textShadow: `
                    0 0 5px #fff,
                    0 0 10px #fff,
                    0 0 20px #fff,
                    0 0 40px #00f3ff,
                    0 0 80px #00f3ff,
                    0 0 90px #00f3ff,
                    0 0 100px #00f3ff,
                    0 0 150px #00f3ff
                  `,
                  color: '#ffffff'
                }}
              >
                The Journey
              </h1>
              <h2 className="text-5xl md:text-4xl font-light subtitle">
                Where Earth's Masterpieces Find Their Destiny
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex flex-col items-center mt-16"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-20 bg-white/50"
              />
            </motion.div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="absolute top-[100vh] left-0 w-full h-[200vh] flex items-start justify-start text-white px-16">
          <div className="max-w-2xl sticky top-0 py-36">
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-5xl font-light mb-8 subtitle">
                Every Gem<br />
                Tells a Story.
              </h2>
              <div className="space-y-4 text-base max-w-sm text-white/90 leading-relaxed subtitle">
                <p>
                  In the depths of South America's most sacred grounds, where Earth crafted its finest treasures over millions of years, we begin our journey of excellence.
                </p>
                <p>
                  From the emerald-rich valleys of Colombia to Brazil's crystal-laden mountains, we seek nature's rarest masterpieces.
                </p>
                <p>
                  At Embrant, we are more than custodians of beauty—we are the architects of legacy.
                </p>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Section 4 */}
        <section className="absolute top-[300vh] left-0 w-full h-[400vh] flex items-start justify-start text-white px-16">
          <div className="max-w-2xl sticky top-0 pt-36">
            <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.6 }}
            >
              <h2 className="text-5xl font-light mb-8 subtitle">
One gem. <br />
Infinite hues.              </h2>
              <div className="space-y-4 text-base max-w-sm text-white/90 leading-relaxed subtitle">
                <p>
                  We scrutinize each stone's clarity, watching as light dances through its pristine structure.
                </p>
                <p>
                  In our private sanctuary, time moves differently. Each evaluation is a reverent ceremony where perfection is the only acceptable outcome.
                </p>
                <p>
                  The depth of color, the whispers of geological rarity, the weight of historical significance—these are the qualities that define an Embrant gemstone.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 5 - Carousel with Subtle Floating Animation and Parallax */}
        <section 
          className="absolute top-[700vh] left-0 w-full h-screen flex items-center justify-center text-white  overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Subtle Floating Parallax Background Images */}
          <motion.div 
            className="fixed inset-0 z-[-1] overflow-hidden"
            style={{
              rotateX,
              rotateY,
              x: translateX,
              y: translateY,
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentImageIndex}
                src={carouselImages[currentImageIndex]}
                alt={`Emerald ${currentImageIndex + 1}`}
                className={`w-full h-full object-cover absolute inset-0 ${currentSection >= 6  ? 'opacity-100' : 'opacity-0'}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate={{
                  ...slideVariants.center,
                  y: [0, -5, 0], // Much more subtle floating
                }}
                exit="exit"
                transition={{
                  x: { duration: 0.6, ease: "easeInOut" },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" } // Slower floating
                }}
              />
            </AnimatePresence>
          </motion.div>

          {/* Subtle Floating Left Arrow with Parallax */}
          <motion.button
            onClick={prevImage}
            className="absolute left-8 z-20 p-4 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all duration-300 group"
            aria-label="Previous image"
            style={{
              x: useTransform(springX, [-0.5, 0.5], [-2, 2]), // Much more subtle
              y: useTransform(springY, [-0.5, 0.5], [-2, 2]),
            }}
            animate={{
              y: [0, -3, 0], // Subtle floating
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <svg 
              className="w-8 h-8 text-white group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Subtle Floating Right Arrow with Parallax */}
          <motion.button
            onClick={nextImage}
            className="absolute right-8 z-20 p-4 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all duration-300 group"
            aria-label="Next image"
            style={{
              x: useTransform(springX, [-0.5, 0.5], [2, -2]), // Subtle reverse
              y: useTransform(springY, [-0.5, 0.5], [2, -2]),
            }}
            animate={{
              y: [0, -4, 0], // Slightly different floating
            }}
            transition={{
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
          >
            <svg 
              className="w-8 h-8 text-white group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

        </section>
      </main>

      <Footer />
    </>
  );
}
