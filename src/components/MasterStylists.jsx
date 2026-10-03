import React, { useEffect, useRef, useState } from 'react';
import { useGSAPReveal } from '../hooks/useGSAPReveal';
import { stylistsData } from '../data/stylistsData';
import { Star, Calendar, Quote } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

function useCardReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
        { threshold: 0.02, rootMargin: '0px 0px -20px 0px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return ref;
}

function StylistCard({ stylist, delay = 0, onSelectStylist }) {
  const [hovered, setHovered] = useState(false);
  const ref = useCardReveal(delay);

  return (
    <div ref={ref} className="reveal-grid-item" style={{ transitionDelay: `${delay}ms` }}>
      <div
        className="group flex flex-col flex-1 rounded-2xl overflow-hidden transition-all duration-300 cursor-default"
        style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)' }}
        onMouseEnter={e => { setHovered(true); e.currentTarget.style.borderColor = 'rgba(212,175,55,0.28)'; }}
        onMouseLeave={e => { setHovered(false); e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
      >
        {/* Portrait */}
        <div className="relative overflow-hidden" style={{ height: '220px', background: '#14141c' }}>
          <img
            src={stylist.avatar}
            alt={stylist.name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700"
            style={{ filter: 'brightness(0.85)', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a10 0%, rgba(10,10,16,0.15) 45%, transparent 100%)' }} />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase" style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.3)', color: '#F4E295' }}>
              {stylist.experience}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full font-mono" style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[10px] font-semibold" style={{ color: '#E6CA65' }}>{stylist.rating}</span>
            </span>
          </div>

          {/* Philosophy overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center transition-opacity duration-300"
            style={{ background: 'rgba(5,5,9,0.93)', backdropFilter: 'blur(8px)', opacity: hovered ? 1 : 0 }}
          >
            <Quote className="w-4 h-4 mb-2 flex-shrink-0" style={{ color: 'rgba(212,175,55,0.28)' }} />
            <p className="font-cormorant italic text-[13px] leading-relaxed" style={{ color: '#dde0ee' }}>
              &ldquo;{stylist.philosophy}&rdquo;
            </p>
          </div>

          {/* Name plate */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <p className="text-[8px] uppercase tracking-[0.22em] font-mono font-semibold mb-0.5" style={{ color: '#C98993' }}>
              {stylist.role}
            </p>
            <h3 className="font-cinzel text-[14px] font-bold text-white leading-snug" style={{ color: hovered ? '#F4E295' : '#fff', transition: 'color 0.2s' }}>
              {stylist.name}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col gap-8 flex-1">
          {/* Specialty tags */}
          <div className="flex flex-wrap gap-1.5">
            {stylist.specialties.slice(0, 2).map((spec, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9C9EA9' }}>
                {spec}
              </span>
            ))}
          </div>

          {/* Signature */}
          <p className="text-[13px] leading-relaxed" style={{ color: '#8a8c98' }}>
            <span style={{ color: '#5a5c6a' }}>Signature — </span>
            <span style={{ color: '#b0b2be' }}>{stylist.signature}</span>
          </p>

          {/* Book button */}
          <button
            onClick={() => { audioManager.playScissorSnip(); onSelectStylist?.(stylist.id); }}
            className="mt-auto w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
            style={{ border: '1px solid rgba(212,175,55,0.28)', color: '#D4AF37', background: 'transparent', padding: '8px 16px', fontSize: '10px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.28)'; }}
          >
            <Calendar className="w-3 h-3" />
            Book {stylist.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MasterStylists({ onSelectStylist, onOpenBooking }) {
  const headerRef = useRef(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stylists" className="w-full relative py-24 lg:py-32 px-5 sm:px-10 lg:px-16" style={{ background: '#070709', borderTop: '1px solid rgba(212,175,55,0.12)' }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,137,147,0.02) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div ref={headerRef} className="reveal flex flex-col items-center text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] font-mono font-semibold mb-3" style={{ color: '#D4AF37' }}>
            Master Craftsmen
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-[44px] font-bold text-white mb-3">
            The Haute <span className="gold-gradient-text">Stylist Atelier</span>
          </h2>
          <div className="w-12 h-px mx-auto mb-4" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
          <p className="font-cormorant italic text-lg sm:text-xl max-w-xl mx-auto text-center leading-relaxed" style={{ color: '#9C9EA9' }}>
            Trained across London, Milan, and Paris. Hover to read their artistic philosophy.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stylistsData.map((stylist, idx) => (
            <StylistCard
              key={stylist.id}
              stylist={stylist}
              delay={idx * 70}
              onSelectStylist={(id) => { onSelectStylist?.(id); onOpenBooking?.(); }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
