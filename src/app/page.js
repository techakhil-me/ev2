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
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

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

  // Images and names for the carousel
  const carouselData = [
    { image: "/emeralds/emerald-1.png", name: "Emerald" },
    { image: "/emeralds/emerald-2.png", name: "Cushion" },
    { image: "/emeralds/emerald-3.png", name: "Heart" },
    { image: "/emeralds/emerald-4.png", name: "Pear" },
    { image: "/emeralds/emerald-5.png", name: "Round" },
    { image: "/emeralds/emerald-6.png", name: "Trillion" },
    { image: "/emeralds/emerald-7.png", name: "Asscher" }
  ]

  // Legacy support - keeping the old array for backward compatibility
  const carouselImages = carouselData.map(item => item.image);

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
      if (section <= 7) {
       setCurrentImageIndex(0) // Reset hover state when past section 6
      }
      
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel autoplay
  useEffect(() => {
   const autoplayInterval = setInterval(() => {
        setDirection(1);
        setCurrentImageIndex((prev) => 
          prev === carouselImages.length - 1 ? 0 : prev + 1
        );
      }, 8000);
  }, [carouselImages.length]);

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

  // Text slide variants for emerald names
  const textSlideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
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

          <div className="fixed inset-0 z-[-1]">
          <video 
            autoPlay 
            loop 
            muted 
            controls={false}
            className={`w-full h-full object-cover transition-opacity duration-700 ${currentSection >= 0 && currentSection < 2 ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/herobg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="fixed inset-0 z-[-1]">
          <img 
            src="/scene2bg.png" 
            alt="Background" 
            className={`w-full h-full object-cover scale-[1.015] ${currentSection >= 5  ? 'opacity-100' : 'opacity-0'}`}

          />
        </div>

        {/* Section 1 */}
        <section className="absolute top-0 left-0 w-full h-screen flex items-end justify-center text-white">
          <div className="text-center px-8 ">
            <motion.div
              {...fadeInUp}
              className="mb-16"
            >
              <h1 
                className="text-3xl md:text-6xl  mb-4 title font-medium tracking-widest"
                
              >
                Journey By Embrant
              </h1>
              <h2 className="text-3xl md:text-5xl  subtitle">
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
                className="w-px h-10 bg-white/50"
              />
            </motion.div>
          </div>
        </section>

      {/* Section 2 */}
            <section className="absolute top-[100vh] left-0 w-full h-[200vh] flex items-start justify-start text-white px-16">
            <div className="max-w-2xl sticky top-0 py-36 pt-48">
              <motion.div
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.2 }}
              className="space-y-6"
              >
              <h2 className="text-3xl md:text-5xl  mb-8 subtitle">
            Every Gem<br />
            Tells A Story.
              </h2>
              <div className="space-y-4 font-bold text-base  max-w-sm text-white/90 leading-relaxed tracking-widest subtitle">
            <p>
             In The Depths Of Earth's Most Sacred Grounds, Where Earth Crafted Its Finest Treasures Over Millions Of Years, We Begin Our Journey Of Excellence.</p>
              </div>
              </motion.div>
            </div>
            </section>


           { /* Section 4 */}
              <section className="absolute top-[300vh] left-0 w-full h-[400vh] flex items-start justify-start text-white px-16">
                <div className="max-w-2xl sticky top-0 pt-48 pb-56">
                  <motion.div
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.6 }}
                  >
                    <h2 className="text-3xl md:text-5xl  mb-8 subtitle">
            One Gem. <br />
            Infinite Hues.              </h2>
                    <div className="space-y-4 text-base font-bold tracking-widest max-w-sm text-white/90 leading-relaxed subtitle">
                     <p>In Our Private Sanctuary, Time Moves Differently. Each Evaluation Is A Reverent Ceremony Where Perfection Is The Only Acceptable Outcome </p>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Section 5 - Carousel with Autoplay and Pause on Hover */}
        <section 
          className={`absolute top-[700vh]  z-[-1] left-0 w-full h-screen flex items-center justify-center text-white overflow-hidden`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsCarouselHovered(true)}
        
        >
          {/* Subtle Floating Parallax Background Images */}
          <motion.div 
            className={`absolute inset-0 z-[-1] overflow-hidden transition-all duration-300 `}
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
                src={carouselData[currentImageIndex].image}
                alt={`Emerald ${currentImageIndex + 1}`}
                className={`w-full h-full object-cover absolute inset-0 `}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate={{
                  ...slideVariants.center,
                  y: [0, -5, 0], // Much more subtle floating
                }}
                exit="exit"
                transition={{
                  x: { duration: 1, ease: "easeInOut" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" } // Slower floating
                }}
              />
            </AnimatePresence>
          </motion.div>

          {/* Emerald Name Display */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentImageIndex}
                custom={direction}
                variants={textSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-light text-white subtitle tracking-wider">
                  {carouselData[currentImageIndex].name}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>
        
          {/* Subtle Floating Left Arrow with Parallax */}
          <motion.button
            onClick={prevImage}
            className="absolute left-8 z-20 p-4  rounded-full transition-all duration-300 group"
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
            className="absolute right-8 z-20 p-4 rounded-full  transition-all duration-300 group"
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
