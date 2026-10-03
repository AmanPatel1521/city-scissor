import React from 'react';
import { Star, Sparkles, Award, Scissors } from 'lucide-react';

const metrics = [
  { icon: Star,     title: '4.9 / 5.0',      subtitle: '1,240+ Google Reviews',        accent: '#D4AF37' },
  { icon: Award,    title: '14+ Years',        subtitle: 'Master Craft Expertise',       accent: '#D4AF37' },
  { icon: Scissors, title: '28,000+ Cuts',     subtitle: 'Sculpted Across Ahmedabad',    accent: '#D4AF37' },
  { icon: Sparkles, title: 'Private Suites',   subtitle: 'Bespoke 1-on-1 Grooming',     accent: '#C98993' },
];

export default function TrustMetricsStrip() {
  return (
    <section className="w-full relative z-10 py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#070709', borderTop: '1px solid rgba(212,175,55,0.18)', borderBottom: '1px solid rgba(212,175,55,0.18)', overflow: 'hidden' }}>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 rounded-full pointer-events-none" style={{ background: 'rgba(212,175,55,0.04)', filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '20px', overflow: 'hidden' }}>
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="flex flex-col items-center justify-center text-center px-10 py-16 group transition-all duration-300"
                style={{ background: '#0d0d12' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = '#0d0d12'}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `rgba(${m.accent === '#C98993' ? '201,137,147' : '212,175,55'},0.12)`, border: `1px solid rgba(${m.accent === '#C98993' ? '201,137,147' : '212,175,55'},0.3)` }}
                >
                  <Icon className="w-6 h-6" style={{ color: m.accent }} />
                </div>
                <div className="font-mono text-white font-bold text-xl sm:text-2xl mb-1 group-hover:text-[#F4E295] transition-colors">
                  {m.title}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: '#7a7c88' }}>
                  {m.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
