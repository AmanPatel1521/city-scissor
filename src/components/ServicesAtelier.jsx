import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronRight, Star, Sparkles } from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import { useGSAPReveal } from '../hooks/useGSAPReveal';
import { animate, stagger } from 'animejs';

const CATEGORIES = [
  { id: 'all',   label: 'All Services'         },
  { id: 'hair',  label: 'Hair Couture'          },
  { id: 'color', label: 'Color & Highlights'    },
  { id: 'skin',  label: 'Skin & Facial Rituals' },
  { id: 'vip',   label: 'VIP Packages'          },
];

const SERVICES = [
  {
    id: 'hc-master-sculpt', category: 'hair',
    title: 'Director Hair Sculpt & Wash',
    subtitle: 'Precision shears tailored to facial bone structure & hair density',
    price: 1800, duration: '60 min', gender: 'Unisex', badge: 'Signature', featured: true,
    includes: ['Scalp analysis', 'Aromatherapy wash', 'Custom blow dry', 'Styling consultation'],
  },
  {
    id: 'hc-balayage-alchemy', category: 'color',
    title: 'French Balayage & Gloss Melting',
    subtitle: "Freehand bespoke light placement with L'Oréal Professionnel & Olaplex",
    price: 6500, duration: '180 min', gender: 'Unisex', badge: 'Atelier Fav', featured: false,
    includes: ['Bond multiplying treatment', 'Custom gloss tone', 'Hydra-boost mask', 'Precision blow dry'],
  },
  {
    id: 'hc-botox-therapy', category: 'hair',
    title: 'Cysteine / Hair Botox Restorative',
    subtitle: 'Intensive keratin protein infusion for mirror-glass shine & frizz elimination',
    price: 5200, duration: '120 min', gender: 'Unisex', badge: 'Restorative', featured: false,
    includes: ['Deep clarifying prep', 'Nano-mist penetration', 'Infrared sealing', 'Homecare regime plan'],
  },
  {
    id: 'sk-hydra-facial', category: 'skin',
    title: 'Diamond Glow Hydra-Dermal Infusion',
    subtitle: 'Non-invasive vortex exfoliation with deep peptide hydration',
    price: 3500, duration: '75 min', gender: 'Unisex', badge: 'Radiance', featured: false,
    includes: ['Vortex suction extractions', 'Hyaluronic booster serum', 'Cold hammer therapy', 'LED light therapy'],
  },
  {
    id: 'vip-groom-couture', category: 'vip',
    title: 'The Ambawadi Royal Groom Suite',
    subtitle: 'Complete head-to-toe bespoke transformation in a private luxury suite',
    price: 8500, duration: '210 min', gender: 'Men', badge: 'VIP Suite', featured: true,
    includes: ['Director hair sculpt', 'Royal hot towel shave', 'Diamond Hydra-facial', 'Hand & foot reflexology spa'],
  },
  {
    id: 'vip-bridal-glam', category: 'vip',
    title: 'Haute Bridal & Red Carpet Suite',
    subtitle: 'Comprehensive bridal glam, hair architecture & full glow transformation',
    price: 12500, duration: '240 min', gender: 'Women', badge: 'Master Suite', featured: false,
    includes: ['Bridal hair architecture', 'HD airbrush makeup', 'Full body de-tan ritual', 'Luxury mani-pedi spa'],
  },
];

function ServiceCard({ service, cardRef, onSelectService, onOpenBooking }) {
  return (
    <div
      ref={cardRef}
      className="service-card-wrapper h-full flex flex-col will-change-transform"
      style={{ opacity: 0 }}
    >
      <div
        className="group flex flex-col flex-1 h-full min-h-[400px] sm:min-h-[460px] rounded-2xl overflow-hidden transition-all duration-300 relative"
        style={service.featured
          ? { background: '#0f0f17', border: '1px solid rgba(212,175,55,0.28)', boxShadow: '0 0 25px rgba(212,175,55,0.06)' }
          : { background: '#0c0c13', border: '1px solid rgba(255,255,255,0.07)' }
        }
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = service.featured ? 'rgba(212,175,55,0.28)' : 'rgba(255,255,255,0.07)';
          e.currentTarget.style.boxShadow = service.featured ? '0 0 25px rgba(212,175,55,0.06)' : 'none';
        }}
      >
        {/* Uniform Top Header Bar for consistent height across all cards */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b shrink-0"
          style={service.featured
            ? { background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.18)' }
            : { background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.04)' }
          }
        >
          {service.featured ? (
            <div className="flex items-center gap-2">
              <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-[#D4AF37]">
                Most Requested
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 opacity-50">
              <Sparkles className="w-2.5 h-2.5 text-[#9C9EA9]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#9C9EA9]">
                Bespoke Atelier
              </span>
            </div>
          )}
          <span
            className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase whitespace-nowrap"
            style={{
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.22)',
              color: '#F4E295',
            }}
          >
            {service.badge}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-5 sm:p-8">
          {/* Meta chips */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#9C9EA9',
              }}
            >
              <Clock className="w-2.5 h-2.5" style={{ color: '#D4AF37' }} />
              {service.duration}
            </span>
            <span
              className="px-3 py-1 rounded-full text-[10px] font-mono uppercase"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#9C9EA9',
              }}
            >
              {service.gender}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-cinzel font-bold text-white mb-2 leading-snug group-hover:text-[#F4E295] transition-colors duration-200"
            style={{ fontSize: '18px' }}
          >
            {service.title}
          </h3>

          {/* Subtitle with guaranteed minimum height so 1-line and 2-line subtitles take identical vertical space */}
          <p
            className="text-[13px] leading-relaxed mb-6 min-h-[42px] flex items-start"
            style={{ color: '#8a8c98' }}
          >
            {service.subtitle}
          </p>

          {/* Includes list expands with flex-1 to equalize cards */}
          <ul className="space-y-2 mb-6 flex-1 flex flex-col justify-start">
            {service.includes.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[12px]" style={{ color: '#9C9EA9' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#D4AF37' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Price + CTA aligned to exact identical bottom baseline */}
          <div
            className="mt-auto pt-4 flex items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <p className="text-[8px] uppercase font-mono tracking-widest mb-0.5" style={{ color: '#4a4c5a' }}>
                Investment
              </p>
              <p className="font-cinzel font-bold text-white leading-none" style={{ fontSize: '22px' }}>
                &#x20B9;{service.price.toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={() => {
                audioManager.playClick();
                onSelectService?.(service.id);
                onOpenBooking?.(service.id);
              }}
              className="btn-gold flex-shrink-0 flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider cursor-pointer hover:scale-105 transition-transform"
              style={{ padding: '8px 18px', fontSize: '10px' }}
            >
              <span>Reserve</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesAtelier({ onSelectService, selectedServiceIds = [], onOpenBooking }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const headerRef = useGSAPReveal('up', 0);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  const filtered = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === activeCategory);

  // Scroll-triggered staggered reveal animation with Anime.js (from animation_generator.py)
  useEffect(() => {
    const cards = cardRefs.current;
    if (!cards || cards.length === 0) return;

    // Reset initial state for smooth entrance
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(55px) scale(0.97)';
    });

    let hasTriggered = false;

    const runAnimeStagger = () => {
      animate(cards, {
        translateY: [55, 0],
        opacity: [0, 1],
        scale: [0.97, 1],
        delay: stagger(90, { start: 50 }),
        ease: 'outExpo',
        duration: 800,
      });
    };

    // Scroll trigger via IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          hasTriggered = true;
          runAnimeStagger();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    // Scroll progress listener pattern from animation_generator.py
    const handleScroll = () => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // If user scrolls past and observer hasn't fired yet
      if (rect.top < windowHeight * 0.85 && !hasTriggered) {
        hasTriggered = true;
        runAnimeStagger();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeCategory, filtered.length]);

  return (
    <section id="services" className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-10 lg:px-16" style={{ background: '#08080c', borderTop: '1px solid rgba(212,175,55,0.12)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal flex flex-col items-center text-center mb-10 sm:mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.4em] font-mono font-semibold mb-2.5 sm:mb-3" style={{ color: '#D4AF37' }}>
            Bespoke Grooming &amp; Hair Architecture
          </p>
          <h2 className="font-cinzel text-2xl sm:text-4xl lg:text-[44px] font-bold text-white mb-3">
            Services <span className="gold-gradient-text">Atelier</span>
          </h2>
          <div className="w-12 h-px mx-auto mb-4" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
          <p className="font-cormorant italic text-base sm:text-xl max-w-lg mx-auto text-center leading-relaxed px-2" style={{ color: '#9C9EA9' }}>
            Curated rituals combining world-class formulas with bespoke precision cutting.
          </p>
        </div>

        {/* Category Filters (Horizontally scrollable on mobile, centered on desktop) */}
        <div className="flex items-center sm:justify-center gap-2 mb-10 sm:mb-16 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:flex-wrap">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                audioManager.playClick();
                setActiveCategory(id);
              }}
              className="rounded-full font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
              style={activeCategory === id
                ? { background: '#D4AF37', color: '#070709', padding: '7px 18px', fontSize: '10.5px', boxShadow: '0 0 14px rgba(212,175,55,0.3)' }
                : { background: '#111118', border: '1px solid rgba(255,255,255,0.09)', color: '#7a7c88', padding: '7px 18px', fontSize: '10.5px' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid with items-stretch ensuring every card stretches to identical height */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              cardRef={addToRefs}
              service={service}
              onSelectService={onSelectService}
              onOpenBooking={onOpenBooking}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="font-cormorant italic text-base mb-4" style={{ color: '#5a5c6a' }}>
            Not sure which ritual is right for you?
          </p>
          <button
            onClick={() => { audioManager.playClick(); onOpenBooking?.(); }}
            className="inline-flex items-center gap-2 rounded-full font-bold uppercase tracking-widest cursor-pointer transition-all duration-200"
            style={{ border: '1px solid rgba(212,175,55,0.28)', background: 'rgba(212,175,55,0.05)', color: '#D4AF37', padding: '9px 24px', fontSize: '10px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.05)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.28)'; }}
          >
            <Sparkles className="w-3 h-3" />
            Speak to a Concierge
          </button>
        </div>

      </div>
    </section>
  );
}
