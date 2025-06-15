'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollTriggeredText = ({ children, className = '', animation = 'fadeInUp', delay = 0 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = elementRef.current;
    if (!element) return;

    const animations = {
      fadeInUp: {
        from: { opacity: 0, y: 100 },
        to: { opacity: 1, y: 0 }
      },
      fadeInLeft: {
        from: { opacity: 0, x: -100 },
        to: { opacity: 1, x: 0 }
      },
      fadeInRight: {
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0 }
      },
      scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 }
      },
      slideInUp: {
        from: { opacity: 0, y: 150, skewY: 7 },
        to: { opacity: 1, y: 0, skewY: 0 }
      }
    };

    const selectedAnimation = animations[animation] || animations.fadeInUp;

    // Set initial state
    gsap.set(element, selectedAnimation.from);

    // Create scroll trigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(element, {
            ...selectedAnimation.to,
            duration: 1,
            delay: delay,
            ease: 'power3.out'
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animation, delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollTriggeredText;