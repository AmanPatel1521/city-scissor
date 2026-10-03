import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPReveal({ children, className = '', direction = 'up', delay = 0, stagger = 0 }) {
  const container = useRef(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    let scale = 1;

    if (direction === 'up') y = 40;
    if (direction === 'left') x = -40;
    if (direction === 'right') x = 40;
    if (direction === 'scale') scale = 0.95;

    gsap.from(el.children, {
      y,
      x,
      scale,
      opacity: 0,
      duration: 1,
      delay: delay,
      stagger: stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });
  }, { scope: container });

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
