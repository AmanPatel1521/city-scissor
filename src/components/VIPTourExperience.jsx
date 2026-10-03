import React from 'react';
import { useGSAPReveal } from '../hooks/useGSAPReveal';
import { Coffee, Wind, Music, Key, CheckCircle, ArrowRight } from 'lucide-react';
import { audioManager } from '../utils/audioManager';


const amenities = [
  { icon: Key,    title: 'Private VIP Cabins',     desc: 'Sound-dampened acoustic styling suites with customised lighting for complete privacy.' },
  { icon: Coffee, title: 'Artisan Espresso Bar',    desc: 'Complimentary single-origin pour-overs, cortados, iced matcha lattes & sparkling mineral water.' },
  { icon: Wind,   title: 'Dyson & Takara Belmont',  desc: 'Ergonomic Japanese motorised chairs with intelligent heat-regulated Dyson Supersonic stations.' },
  { icon: Music,  title: 'Acoustic Soundscape',     desc: 'Binaural lounge ambient soundscape designed to eliminate salon stress and promote deep relaxation.' },
];

export default function VIPTourExperience({ onOpenBooking }) {
  const leftRef  = useGSAPReveal('left', 0);
  const rightRef = useGSAPReveal('right', 0);

  return (
    <section id="vip-experience" className="w-full py-24 lg:py-32 px-5 sm:px-10 lg:px-16" style={{ background: '#0a0a0f', borderTop: '1px solid rgba(212,175,55,0.12)' }}>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: Images */}
          <div ref={leftRef} className="reveal reveal-left">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden relative" style={{ height: '440px', background: '#111116', border: '1px solid rgba(212,175,55,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
              <img
                src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80"
                alt="City Scissor VIP Suite Interior"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.8) contrast(1.05)' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,7,9,0.75) 0%, transparent 60%)' }} />

              {/* Stat badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider" style={{ background: 'rgba(7,7,9,0.9)', border: '1px solid rgba(212,175,55,0.4)', color: '#F4E295', backdropFilter: 'blur(8px)' }}>
                  Est. 2010
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider" style={{ background: 'rgba(7,7,9,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: '#C0C2C9', backdropFilter: 'blur(8px)' }}>
                  2,400 sq.ft.
                </span>
              </div>

              {/* Bottom caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3.5 rounded-xl" style={{ background: 'rgba(7,7,9,0.92)', border: '1px solid rgba(212,175,55,0.18)', backdropFilter: 'blur(12px)' }}>
                <div>
                  <p className="font-cinzel text-sm font-bold text-white leading-snug">Ambawadi Flagship Atelier</p>
                  <p className="text-[10px] font-mono" style={{ color: '#9C9EA9' }}>Scandinavian &amp; Japanese Luxury</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider flex-shrink-0" style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.35)', color: '#F4E295' }}>
                  VIP Level
                </span>
              </div>
            </div>

            {/* Espresso accent card */}
            <div className="mt-3 rounded-xl overflow-hidden relative" style={{ height: '100px', border: '1px solid rgba(212,175,55,0.15)' }}>
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
                alt="Artisan espresso bar"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.6)' }}
              />
              <div className="absolute inset-0 flex items-center px-5" style={{ background: 'linear-gradient(to right, rgba(7,7,9,0.85) 0%, transparent 70%)' }}>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-wider mb-0.5" style={{ color: '#D4AF37' }}>Included with VIP Suite</p>
                  <p className="font-cinzel text-sm font-bold text-white">Artisan Espresso Bar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Amenities */}
          <div ref={rightRef} className="reveal reveal-right flex flex-col gap-8">

            {/* Header */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] font-mono font-semibold mb-4" style={{ color: '#D4AF37' }}>
                The Atelier Environment
              </p>
              <div className="pl-4 mb-4" style={{ borderLeft: '2px solid rgba(212,175,55,0.45)' }}>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Beyond a Salon —<br />
                  <span className="gold-gradient-text">A Multi-Sensory Sanctuary</span>
                </h2>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: '#8a8c98' }}>
                Designed for those who view personal grooming as an essential lifestyle investment.
                Every corner of our Ambawadi atelier space is calibrated for tranquil privacy and precision results.
              </p>
            </div>

            {/* Amenity cards — 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {amenities.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-4 p-8 rounded-2xl transition-all duration-200 group"
                    style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.28)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#1c1c28', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Icon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      </div>
                      <span className="font-cinzel font-bold leading-none select-none" style={{ fontSize: '26px', color: 'rgba(212,175,55,0.07)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="font-cinzel text-sm font-bold text-white group-hover:text-[#F4E295] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#8a8c98' }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Silent appointment */}
            <div className="flex items-start gap-8 p-5 rounded-xl text-[13px]" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
              <p className="leading-relaxed" style={{ color: '#b0b2be' }}>
                <strong className="text-white font-semibold">&ldquo;Silent Appointment&rdquo; Option — </strong>
                Pure quiet with zero small talk. Requestable during booking.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => { audioManager.playScissorSnip(); onOpenBooking?.(); }}
              className="btn-gold self-start flex items-center gap-2.5 px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest cursor-pointer"
            >
              Reserve VIP Suite
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}
