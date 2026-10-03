import React from 'react';
import { useGSAPReveal } from '../hooks/useGSAPReveal';
import { MapPin, ExternalLink, Car, Layers, Navigation } from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import logoAsset from '../assets/city-scissor-logo.jpg';

export default function StreetViewLocation() {
  const headerRef = useGSAPReveal('up', 0);

  // Exact coordinates: City Scissor Unisex Salon, Main Road, Opp. BRTS Bus Stop, Ambawadi
  const lat = '23.0185263';
  const lng = '72.5442427';
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=17&output=embed`;
  const directionsUrl = `https://www.google.com/maps/place/City+Scissor+unisex+salon/@${lat},${lng},17z`;

  const transitBenchmarks = [
    { from: 'C.G. Road', time: '5 Mins', dist: '1.4 km' },
    { from: 'Vastrapur / IIM', time: '10 Mins', dist: '3.8 km' },
    { from: 'S.G. Highway', time: '15 Mins', dist: '5.2 km' },
    { from: 'Ahmedabad Airport', time: '30 Mins', dist: '14.5 km' },
  ];

  const [loadMap, setLoadMap] = React.useState(false);
  const mapContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="location" className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-10 lg:px-16 bg-[#0a0a0f]" style={{ borderTop: '1px solid rgba(212,175,55,0.15)', overflow: 'hidden' }}>

      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div ref={headerRef} className="reveal flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121220] border border-[#D4AF37]/30 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-mono font-semibold mb-3 sm:mb-4 text-[#D4AF37]">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Studio Location &amp; Arrival</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Main Road, <span className="gold-gradient-text">Ambawadi</span>
          </h2>
          <div className="w-16 h-px mb-4" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
          <p className="text-xs sm:text-sm max-w-xl text-center leading-relaxed px-2" style={{ color: '#9C9EA9' }}>
            Prominently positioned on the main road directly opposite the Ambawadi BRTS bus stop, offering effortless access and white-glove arrival.
          </p>
        </div>

        {/* Location Badge Indicator */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-medium" style={{ background: '#121220', border: '1px solid rgba(212,175,55,0.25)', color: '#E6CA65' }}>
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Interactive Dark City Map</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse ml-1" />
          </div>
        </div>

        {/* Main Studio Window & Map Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

          {/* Main Map Visual Window (8 Cols) */}
          <div className="lg:col-span-8">
            <div
              ref={mapContainerRef}
              className="relative w-full rounded-2xl overflow-hidden bg-[#0d0d12] shadow-2xl h-[330px] sm:h-[440px]"
              style={{ border: '1px solid rgba(212,175,55,0.28)' }}
            >
              <div className="absolute inset-0 w-full h-full bg-[#070709]">
                {loadMap ? (
                  <iframe
                    title="City Scissor unisex salon location map in Ambawadi"
                    src={mapUrl}
                    className="w-full h-full border-0"
                    style={{ filter: 'grayscale(1) invert(0.9) hue-rotate(180deg) brightness(0.72) contrast(1.08) saturate(0.62)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#9C9EA9] gap-3">
                    <MapPin className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                    <p className="text-[11px] font-mono uppercase tracking-widest text-[#E6CA65]">Loading Ambawadi Studio Map...</p>
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 44px rgba(7,7,9,1)' }} />
              </div>

              {/* Studio Location Overlay Card */}
              <div className="absolute bottom-3 left-3 sm:bottom-8 sm:left-8 z-20 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:px-4 sm:py-3 rounded-xl pointer-events-none max-w-[calc(100%-1.5rem)] sm:max-w-none"
                style={{ background: 'rgba(7,7,9,0.92)', border: '1px solid rgba(212,175,55,0.4)', backdropFilter: 'blur(12px)' }}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: 'rgba(212,175,55,0.6)' }}>
                  <img src={logoAsset} alt="City Scissor Unisex Salon Logo" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-[11px] sm:text-xs font-bold font-cinzel truncate">CITY SCISSOR UNISEX SALON</p>
                  <p className="text-[9px] sm:text-[10px] font-mono truncate" style={{ color: '#D4AF37' }}>Main Road, Opp. BRTS Bus Stop, Ambawadi</p>
                </div>
              </div>

              {/* Open in Maps Button */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playClick()}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[9.5px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #F4E295, #D4AF37, #B89020)', color: '#070709', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Travel Estimates (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5 h-full">
            <div className="flex flex-col h-full gap-4 p-5 sm:p-8 rounded-2xl" style={{ background: '#0e0e16', border: '1px solid rgba(212,175,55,0.18)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.28em] font-mono font-semibold" style={{ color: '#D4AF37' }}>
                  Transit Benchmarks
                </span>
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              
              <div className="flex flex-col gap-3 flex-1 justify-center">
                {transitBenchmarks.map((b) => (
                  <div
                    key={b.from}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl text-xs transition-all hover:bg-[#1a1a24]"
                    style={{ background: '#14141c', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span className="font-medium" style={{ color: '#E4E6EB' }}>{b.from}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[10px] sm:text-[11px]" style={{ color: '#8a8c98' }}>{b.dist}</span>
                      <span className="px-3 py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold"
                        style={{ background: 'rgba(212,175,55,0.12)', color: '#F4E295', border: '1px solid rgba(212,175,55,0.2)' }}>
                        {b.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3.5 p-4 mt-2 rounded-xl text-xs"
                style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Car className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <div>
                  <p className="text-white font-semibold mb-0.5 text-[13px]">White-Glove Valet</p>
                  <p className="text-[11px]" style={{ color: '#a0a2af' }}>Complimentary at main road entrance (Opp. BRTS)</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
