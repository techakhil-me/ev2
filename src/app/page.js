'use client';
import PngSequenceAnimation from "../components/PngSequenceAnimation";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);

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

  return (
    <>
      <main className="relative z-10 min-h-[600vh]">
        {/* First Animation - plays from 0% to 33% of scroll */}
        <PngSequenceAnimation 
          totalFrames={133} 
          srcPrefix="/scene1/scene1-"
          startTrigger={0}
          endTrigger={0.33}
          id="scene1"
          className={currentSection >= 0 && currentSection < 2 ? 'opacity-100' : 'opacity-0'}
        />

        {/* Second Animation - plays from 33% to 66% of scroll */}
        <PngSequenceAnimation 
          totalFrames={133} 
          srcPrefix="/scene1/scene1-"
          startTrigger={0.40}
          endTrigger={0.66}
          id="scene2"
          className={currentSection >= 2 && currentSection < 4 ? 'opacity-100' : 'opacity-0'}
        />

        {/* Third Animation - plays from 66% to 100% of scroll */}
        <PngSequenceAnimation 
          totalFrames={133} 
          srcPrefix="/scene1/scene1-"
          startTrigger={0.66}
          endTrigger={1.0}
          id="scene3"
          className={currentSection >= 4 ? 'opacity-100' : 'opacity-0'}
        />

        {/* Section 1 */}
        <section className="h-screen flex items-center justify-center text-white">
          <div className="text-center px-8 pt-32">
            <motion.div
              initial={{ opacity: 0, x: 0, y: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="mb-16"
            >
              <h1 className="text-6xl md:text-7xl font-thin italic mb-4 title">
                Journey By Embrant
              </h1>
              <h2 className="text-5xl md:text-4xl font-light subtitle">
                Where Earth's Masterpieces Find Their Destiny
              </h2>
            </motion.div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="h-screen flex items-center justify-start text-white px-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: 0, y: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-5xl font-light mb-8 subtitle">
                Every Gem<br />
                Tells a Story.
              </h2>
              <div className="space-y-4 text-base max-w-sm text-white/90 leading-relaxed subtitle">
                <p>Scene 1 - The Beginning</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="h-screen flex items-center justify-center text-white">
          <div className="text-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-5xl font-light mb-8 subtitle">
                The Journey Continues
              </h2>
              <p className="text-lg">Scene 2 - The Transformation</p>
            </motion.div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="h-screen flex items-center justify-start text-white px-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: 0, y: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl font-light mb-8 subtitle">
                Master Craftsmanship
              </h2>
              <p className="text-lg">Scene 2 continues...</p>
            </motion.div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="h-screen flex items-center justify-center text-white">
          <div className="text-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl font-light mb-8 subtitle">
                The Final Creation
              </h2>
              <p className="text-lg">Scene 3 - The Masterpiece</p>
            </motion.div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="h-screen flex items-center justify-center text-white">
          <div className="text-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl font-light mb-8 subtitle">
                Legacy Complete
              </h2>
              <p className="text-lg">The journey ends where legends begin</p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
