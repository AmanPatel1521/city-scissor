import React from 'react';
import { useGSAPReveal } from '../hooks/useGSAPReveal';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, ArrowRight, Scissors } from 'lucide-react';
import CityScissorLogo from './CityScissorLogo';
import { audioManager } from '../utils/audioManager';


const instaImages = [
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
];

export default function Footer({ onOpenBooking }) {
  const ctaRef   = useGSAPReveal('up', 0);
  const gridRef  = useGSAPReveal('up', 0);

  return (
    <footer className="bg-[#050507] text-[#8a8c98]" style={{ borderTop: '1px solid rgba(212,175,55,0.18)' }}>

      {/* ── CTA Strip ── */}
      <div
        ref={ctaRef}
        className="reveal"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 50%, rgba(212,175,55,0.05) 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-14 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] font-mono font-semibold mb-3" style={{ color: '#D4AF37' }}>
            Begin Your Transformation
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            Ready for Your <span className="gold-gradient-text">Signature Look?</span>
          </h2>
          <p className="font-cormorant italic text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed" style={{ color: '#8a8c98' }}>
            Reserve your private ritual at our Ambawadi atelier, directly on the main road opposite the BRTS bus stop. Same-day appointments available.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto">
            <button
              onClick={() => { audioManager.playScissorSnip(); onOpenBooking?.(); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #F4E295, #D4AF37, #B89020)', color: '#070709', boxShadow: '0 0 30px rgba(212,175,55,0.35)' }}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Reserve Your Chair</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="tel:+917948921100"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-200"
              style={{ border: '1px solid rgba(212,175,55,0.35)', color: '#D4AF37', background: 'transparent' }}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div ref={gridRef} className="reveal pt-14 pb-10 px-5 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">

            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <CityScissorLogo className="w-9 h-9" />
                <span className="font-cinzel text-[17px] font-bold text-white tracking-wider">
                  CITY <span className="gold-gradient-text">SCISSOR</span>
                </span>
              </div>
              <div className="w-10 h-px" style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.5), transparent)' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#8a8c98' }}>
                Ahmedabad's pinnacle unisex salon atelier. Japanese high-carbon shears, Parisian balayage alchemy, and luxury rituals on the Main Road (Opp. BRTS), Ambawadi.
              </p>
              <div className="flex items-center gap-2.5">
                {[
                  { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
                  { href: 'https://facebook.com',  Icon: Facebook,  label: 'Facebook' },
                  { href: 'https://youtube.com',   Icon: Youtube,   label: 'YouTube' },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`City Scissor ${label}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                    style={{ background: '#121220', border: '1px solid rgba(255,255,255,0.08)', color: '#9C9EA9' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#9C9EA9'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Location column */}
            <div className="flex flex-col gap-3">
              <h4 className="font-cinzel text-[11px] font-bold text-white uppercase tracking-wider mb-1">Ambawadi Atelier</h4>
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                <span className="leading-relaxed" style={{ color: '#b0b2be' }}>
                  Main Road, Opp. BRTS Bus Stop,<br />Ambawadi Circle, Ahmedabad 380006
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <a href="tel:+917948921100" style={{ color: '#b0b2be' }}>+91 79 4892 1100</a>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <a href="mailto:concierge@cityscissor.in" style={{ color: '#b0b2be' }} className="truncate">concierge@cityscissor.in</a>
              </div>
              <div className="flex items-start gap-2 text-xs pt-1">
                <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                <div>
                  <p className="text-white font-medium">Tue – Sun: 10 AM – 9 PM</p>
                  <p style={{ color: '#6a6c7a' }}>Monday — Closed</p>
                </div>
              </div>
            </div>

            {/* Rituals column */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-cinzel text-[11px] font-bold text-white uppercase tracking-wider mb-1">Haute Rituals</h4>
              {['Precision Dry Cut', 'French Balayage', 'Caviar Hair Botox', 'Damascus Shave', 'Japanese Scalp Spa', 'Bridal VIP Suite'].map(item => (
                <a key={item} href="#services" className="flex items-center gap-2 text-xs transition-colors duration-150 group" style={{ color: '#b0b2be' }}>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.4)' }} />
                  {item}
                </a>
              ))}
            </div>

            {/* Instagram column */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-cinzel text-[11px] font-bold text-white uppercase tracking-wider">@CityScissor</h4>
                <span className="text-[9px] font-mono" style={{ color: '#D4AF37' }}>18.5k</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {instaImages.map((img, i) => (
                  <a
                    key={i}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="relative block rounded-lg overflow-hidden group"
                    style={{ aspectRatio: '1', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <img
                      src={img}
                      alt={`Atelier ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{ filter: 'brightness(0.7)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <Instagram className="w-3.5 h-3.5 text-white" />
                    </div>
                  </a>
                ))}
              </div>
              <button
                onClick={() => { audioManager.playScissorSnip(); onOpenBooking?.(); }}
                className="w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer mt-1 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #F4E295, #D4AF37, #B89020)', color: '#070709' }}
              >
                Reserve a Chair
              </button>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#4a4c5a' }}>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <p>© {new Date().getFullYear()} City Scissor Unisex Salon. All rights reserved.</p>
              <span className="hidden sm:block" style={{ color: 'rgba(212,175,55,0.25)' }}>·</span>
              <p style={{ color: '#4a4c5a', fontStyle: 'italic' }}>Crafted with precision in Ahmedabad.</p>
            </div>
            <div className="flex items-center gap-5">
              <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
              <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
              <span className="font-mono" style={{ color: '#D4AF37' }}>4.9 ★ Google</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
