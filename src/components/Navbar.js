'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Journey', href: '#' },
    { name: 'Signature Collection', href: 'https://embrant.com/embrant/signature-collection/' },
    { name: 'Gemstones', href: 'https://embrant.com/embrant/gemstone/' },
    { name: 'Book An Appointment', href: 'https://embrant.com/embrant/bookanappointment/' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-white backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-50"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-black origin-center transition-all duration-300"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-black transition-all duration-300"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-black origin-center transition-all duration-300"
              />
            </button>

            {/* Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src="/embrant.png" 
                alt="Embrant" 
                className="h-12 w-auto"
              />
            </div>

            {/* Book Appointment Button */}
            <button 
              onClick={() => window.open('https://embrant.com/embrant/bookanappointment/', '_blank')}
              className="px-6 hidden md:block py-2 border subtitle border-black text-black text-sm font-light rounded-full hover:bg-black/10 transition-all duration-300"
            >
              Book An Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-lg subtitle z-[100]"
          >
            {/* Close Button */}
            <div className="absolute top-6 right-6">
              <button
                onClick={toggleMenu}
                className="w-8 h-8 flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col items-center justify-center h-full px-8">
              

              {/* Navigation Items */}
              <div className="space-y-8 text-center">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.2 + (index * 0.1), 
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={toggleMenu}
                      target={item.href.startsWith('http') ? '_blank' : '_self'}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="block text-2xl md:text-3xl font-light text-gray-800 hover:text-amber-600 transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                  </motion.div>
                ))}
              </div>

           
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;