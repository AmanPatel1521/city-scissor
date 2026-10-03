import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, Clock, MapPin, Menu, X, Volume2, VolumeX, Phone, ExternalLink } from 'lucide-react';
import CityScissorLogo from './CityScissorLogo';
import { audioManager } from '../utils/audioManager';

export default function Navbar({ onOpenBooking, isAudioActive, onToggleAudio }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Ambawadi Salon Local Time (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' };
      setCurrentTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'SERVICES', href: '#services' },
    { label: 'LOOKBOOK', href: '#lookbook' },
    { label: 'LOCATION', href: '#location' },
    { label: 'MASTER STYLISTS', href: '#stylists' },
    { label: 'VIP EXPERIENCE', href: '#vip-experience' },
  ];

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);
    audioManager.playClick();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#070709]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#070709]/95 via-[#070709]/75 to-transparent py-3.5 sm:py-4'
      }`}
    >
      {/* Full Width Container with Logo on Far Left and Menus Aligned to Top Right */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between">
        
        {/* Brand Logo (Far Left) with Official Winged Unisex Shears Emblem */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            audioManager.playScissorSnip();
          }}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="group-hover:scale-105 transition-transform duration-300">
            <CityScissorLogo className="w-9 h-9 sm:w-10 sm:h-10" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-white whitespace-nowrap">
              CITY <span className="gold-gradient-text">SCISSOR</span>
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-[#9C9EA9] uppercase font-mono whitespace-nowrap">
              Unisex Salon • Ambawadi
            </span>
          </div>
        </a>

        {/* Right Menu Cluster: Responsive Links, Sound, and Reserve Slot CTA */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 lg:gap-5 shrink-0">
          
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-[11px] xl:text-xs uppercase tracking-[0.15em] text-[#C0C2C9] hover:text-[#D4AF37] transition-colors relative py-1 group font-medium whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Live "Open Now" Status Badge (Shown on 2XL wide screens) */}
          <div className="hidden 2xl:inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#121218] border border-[#D4AF37]/35 text-xs shadow-sm shrink-0">
            <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[#E6CA65] font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
              OPEN NOW
            </span>
            <span className="text-[#64748B]/60 text-[10px]">|</span>
            <span className="text-[#9C9EA9] font-mono text-[11px] whitespace-nowrap">
              {currentTime} IST
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const active = onToggleAudio();
              if (active) {
                audioManager.playScissorSnip(1.05);
              }
            }}
            className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center cursor-pointer shrink-0 overflow-hidden ${
              isAudioActive
                ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F4E295] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'border-white/10 bg-white/5 text-[#9C9EA9] hover:text-white hover:border-white/25'
            }`}
            title={isAudioActive ? 'Mute sound' : 'Enable sound'}
            aria-label="Toggle Sound"
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reserve Slot Button with Spacious Pill Border & Zero Edge Clipping */}
          <button
            onClick={() => {
              audioManager.playClick();
              onOpenBooking();
            }}
            className="btn-gold pill-medium text-xs font-bold tracking-wider uppercase flex items-center gap-2.5 cursor-pointer shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-105 transition-transform whitespace-nowrap overflow-hidden"
          >
            <Calendar className="w-4 h-4 text-black shrink-0" />
            <span>RESERVE SLOT</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#14141c] border border-white/10 text-white cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0f]/98 border-b border-[#D4AF37]/20 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-xs uppercase tracking-widest text-[#C0C2C9] hover:text-[#D4AF37] py-2 border-b border-white/5 font-mono"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="btn-gold w-full py-3 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>RESERVE SLOT</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
