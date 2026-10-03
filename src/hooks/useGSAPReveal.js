import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Drop-in replacement for the old IntersectionObserver-based useReveal.
 * Uses GSAP ScrollTrigger for smooth, GPU-accelerated entrances.
 * 
 * @param {'up'|'down'|'left'|'right'|'scale'} direction  Animation direction
 * @param {number} delayMs  Delay in milliseconds before animation starts
 */
export function useGSAPReveal(direction = 'up', delayMs = 0) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;

    // Ensure element is fully visible by default in case GSAP doesn't fire
    // (e.g. prefers-reduced-motion, SSR, or if already in viewport on load)
    gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'none' });

    let fromVars = { opacity: 0 };

    if (direction === 'up')    fromVars = { opacity: 0, y: isMobile ? 18 : 36 };
    if (direction === 'down')  fromVars = { opacity: 0, y: isMobile ? -18 : -36 };
    // On mobile, never translate on X to avoid horizontal scrollbar blowout
    if (direction === 'left')  fromVars = { opacity: 0, x: isMobile ? 0 : -40, y: isMobile ? 18 : 0 };
    if (direction === 'right') fromVars = { opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 18 : 0 };
    if (direction === 'scale') fromVars = { opacity: 0, scale: isMobile ? 0.98 : 0.94 };

    const toVars = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: isMobile ? 0.6 : 1.1,
      delay: isMobile ? 0 : delayMs / 1000,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: isMobile ? 'top 95%' : 'top 88%',
        toggleActions: 'play none none none', // play once only
      },
    };

    gsap.fromTo(el, fromVars, toVars);
  }, { scope: ref });

  return ref;
}
