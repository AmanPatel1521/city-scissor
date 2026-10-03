import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Scissors, ArrowRight } from 'lucide-react';
import CityScissorLogo from './CityScissorLogo';
import { audioManager } from '../utils/audioManager';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ onOpenBooking, onExploreServices }) {
  const container = useRef(null);
  const word1Ref = useRef([]);
  const word2Ref = useRef([]);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const crestRef = useRef(null);
  const quoteRef = useRef(null);
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;

    // Background slow pulsing & parallax setup
    gsap.to(bg1Ref.current, { scale: 1.1, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(bg2Ref.current, { scale: 1.15, rotation: 10, duration: 10, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Always ensure elements are at full opacity by default
    gsap.set(
      [
        crestRef.current,
        ...word1Ref.current,
        ...word2Ref.current,
        subtitleRef.current,
        quoteRef.current,
        buttonsRef.current,
      ],
      { opacity: 1, y: 0, x: 0 }
    );

    // On mobile, skip the slow staggered blocking timeline so text is 100% visible immediately
    if (isMobile) {
      return;
    }

    gsap.to(bg1Ref.current, {
      y: 200,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.to(bg2Ref.current, {
      y: -150,
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Main text animation sequence on desktop
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
    tl.from(crestRef.current, { opacity: 0, y: -20, duration: 0.8 }, "+=0.1")
      .from(word1Ref.current, 
        { opacity: 0, y: (i) => i % 2 === 0 ? -30 : 30, duration: 0.8, stagger: 0.05 }, "-=0.4")
      .from(word2Ref.current, 
        { opacity: 0, y: (i) => i % 2 === 0 ? 30 : -30, duration: 0.8, stagger: 0.05 }, "-=0.6")
      .from(subtitleRef.current, { opacity: 0, y: 15, duration: 0.6 }, "-=0.4")
      .from(quoteRef.current, { opacity: 0, y: 15, duration: 0.6 }, "-=0.4")
      .from(buttonsRef.current, { opacity: 0, y: 15, duration: 0.6 }, "-=0.4");
  }, { scope: container });

  const word1 = "CITY";
  const word2 = "SCISSOR";

  return (
    <section ref={container} className="w-full relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      
      {/* Background Soft Atmospheric Radial Glow Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div ref={bg1Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/8 rounded-full blur-[180px]" />
        <div ref={bg2Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C98993]/6 rounded-full blur-[160px]" />

        {/* Grid Overlay matching original */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(244,226,149,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,226,149,0.05) 1px, transparent 1px)',
            backgroundSize: '96px 96px',
            maskImage: 'linear-gradient(to bottom, transparent, black 24%, black 76%, transparent)',
          }}
        />
        <div className="absolute inset-x-0 top-[22%] h-px bg-[#D4AF37]/30" />
      </div>

      {/* Main Content: Dead-Center in the Screen */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center my-auto w-full">

        {/* 1. Top Refined Atelier Crest */}
        <div ref={crestRef} className="inline-flex items-center pill-status bg-[#111117]/90 border border-[#D4AF37]/35 shadow-[0_0_20px_rgba(212,175,55,0.12)] mb-6 sm:mb-8 max-w-[94vw] text-center">
          <CityScissorLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" glow={false} />
          <span className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.25em] text-[#E6CA65] font-mono font-semibold truncate sm:whitespace-normal">
            Opp. BRTS Bus Stop • Ambawadi • Ahmedabad
          </span>
        </div>

        {/* 2. Dead-Center Monumental Kinetic Title */}
        <div className="relative w-full mb-5 sm:mb-6 text-center flex flex-col items-center justify-center px-2">
          <h1 className="font-cinzel text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight select-none py-1 sm:py-2 text-center mx-auto leading-none">
            <span className="inline-block mr-2 sm:mr-6 whitespace-nowrap">
              {word1.split('').map((char, index) => (
                <span
                  key={index}
                  ref={el => word1Ref.current[index] = el}
                  className="inline-block text-white"
                >
                  {char}
                </span>
              ))}
            </span>

            <span className="inline-block whitespace-nowrap">
              {word2.split('').map((char, index) => (
                <span
                  key={index}
                  ref={el => word2Ref.current[index] = el}
                  className="inline-block gold-gradient-text"
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          <p ref={subtitleRef} className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.45em] text-[#C98993] font-mono mt-2.5 sm:mt-3 font-semibold text-center mx-auto">
            Haute Coiffure &amp; Bespoke Styling Atelier
          </p>
        </div>

        {/* 3. Airy, Poetic Subtitle */}
        <p ref={quoteRef} className="font-cormorant text-base xs:text-lg sm:text-2xl md:text-3xl italic text-[#C0C2C9] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light text-center px-4">
          "Where high-precision Japanese shears meet bespoke hair architecture."
        </p>

        {/* 4. Symmetrical Centered Luxury CTAs */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mx-auto w-full max-w-[320px] sm:max-w-none px-2">
          <button
            onClick={() => {
              audioManager.playScissorSnip();
              onOpenBooking();
            }}
            className="btn-gold pill-large w-full sm:w-[300px] font-bold tracking-wider sm:tracking-widest uppercase cursor-pointer shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm"
          >
            <Scissors className="w-4 h-4 text-black shrink-0" />
            <span>Reserve Appointment</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onExploreServices?.();
            }}
            className="btn-outline-gold pill-large w-full sm:w-[300px] font-semibold tracking-wider sm:tracking-widest uppercase cursor-pointer hover:scale-105 transition-transform flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] shrink-0" />
          </button>
        </div>

      </div>

    </section>
  );
}
