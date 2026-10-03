import React from 'react';
import { useGSAPReveal } from '../hooks/useGSAPReveal';
import { Star, Quote, Award, CheckCircle } from 'lucide-react';


const reviews = [
  {
    name: 'Aditi Shah', initials: 'AS', title: 'Architect & Design Principal, Ambawadi',
    rating: 5, service: 'French Balayage & Parisian Bob',
    text: "City Scissor is in a league of its own in Ahmedabad. Rhea's understanding of undertones and Aryan's blade geometry created the most effortless balayage I've ever had.",
  },
  {
    name: 'Rohan Parikh', initials: 'RP', title: 'Tech Founder, SG Highway',
    rating: 5, service: 'Executive Fade & Royal Hot Towel Shave',
    text: 'The Damascus hot towel shave with Kabir was an absolute ritual. Laser-clean lines, zero razor burn, and the private cabin meant I could take an important call before heading back to the office.',
  },
  {
    name: 'Dr. Meera Patel', initials: 'MP', title: 'Dermatologist, Bodakdev',
    rating: 5, service: 'Caviar Hair Botox Ritual',
    text: 'As a dermatologist, I am extremely particular about scalp chemistry. The Black Caviar Botox protocol restored elasticity to my humidity-damaged hair with zero harsh chemicals.',
  },
  {
    name: 'Naina Kothari', initials: 'NK', title: 'Fashion Editor, Vastrapur',
    rating: 5, service: 'Haute Bridal & Red Carpet Suite',
    text: "I've been to salons from Delhi to Dubai, and City Scissor's bridal suite is unmatched. Dr. Tanya's scalp ritual made my hair feel like silk for weeks. The definitive Ahmedabad luxury salon.",
  },
];

const marqueeReviews = [...reviews, ...reviews];

export default function ReviewsPress() {
  const headerRef = useGSAPReveal('up', 0);
  const pressRef  = useGSAPReveal('up', 0);

  return (
    <section className="w-full py-24 lg:py-32" style={{ background: '#070709', borderTop: '1px solid rgba(212,175,55,0.12)', overflow: 'hidden' }}>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 mb-16">
        <div ref={headerRef} className="reveal flex flex-col items-center text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] font-mono font-semibold mb-4" style={{ color: '#D4AF37' }}>
            Guest Commendations
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Praised by <span className="gold-gradient-text">Ahmedabad&rsquo;s Connoisseurs</span>
          </h2>
          <div className="w-14 h-px mx-auto mb-5" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
          <p className="font-cormorant italic text-lg sm:text-xl max-w-xl mx-auto text-center leading-relaxed" style={{ color: '#9C9EA9' }}>
            Over 1,240 verified 5-star ratings across Ambawadi, Vastrapur, Bodakdev, and beyond.
          </p>
        </div>
      </div>

      {/* Marquee track */}
      <div className="relative mb-16" style={{ overflow: 'hidden' }}>
        {/* Fades */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-24 pointer-events-none" style={{ background: 'linear-gradient(to right, #070709, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-24 pointer-events-none" style={{ background: 'linear-gradient(to left, #070709, transparent)' }} />

        <div className="marquee-track" style={{ gap: '20px', paddingLeft: '20px', paddingTop: '6px', paddingBottom: '8px' }}>
          {marqueeReviews.map((rev, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col p-8 rounded-3xl"
              style={{ width: '340px', background: '#0e0e16', border: '1px solid rgba(212,175,55,0.12)' }}
            >
              {/* Stars + quote */}
              <div className="flex items-start justify-between mb-3">
                <Quote className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(212,175,55,0.18)' }} />
                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-2.5 h-2.5" style={{ fill: '#D4AF37', color: '#D4AF37' }} />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="font-cormorant text-[15px] italic leading-relaxed mb-4 flex-1" style={{ color: '#dde0ee' }}>
                &ldquo;{rev.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="pt-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-[10px] font-bold text-black" style={{ background: 'linear-gradient(135deg, #F4E295, #D4AF37)' }}>
                  {rev.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-cinzel text-[11px] font-bold text-white truncate">{rev.name}</span>
                    <span className="flex items-center gap-0.5 flex-shrink-0 text-[9px] font-mono" style={{ color: '#34d399' }}>
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] truncate" style={{ color: '#6a6c7a' }}>{rev.title}</p>
                  <p className="text-[9px] font-mono" style={{ color: '#D4AF37' }}>{rev.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Press awards */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
        <div ref={pressRef} className="reveal p-6 sm:p-8 rounded-2xl" style={{ background: '#0d0d13', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-center text-[9px] uppercase tracking-[0.35em] mb-7 font-mono" style={{ color: '#4a4c5a' }}>
            As Recognised By
          </p>
          <div className="flex flex-wrap items-center justify-around gap-6 text-center">
            {[
              { Icon: Award,       title: 'Times Lifestyle Awards', sub: 'Best Luxury Salon Gujarat 2025' },
              { Icon: Star,        title: 'Google Verified',        sub: '4.9 / 5.0 · 1,240+ Reviews'   },
              { Icon: CheckCircle, title: "L'Oréal Coiffure",       sub: 'Master Color Atelier Center'   },
            ].map(({ Icon, title, sub }, i, arr) => (
              <React.Fragment key={title}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Icon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  </div>
                  <span className="font-cinzel text-[11px] font-bold" style={{ color: '#D4AF37', letterSpacing: '0.08em' }}>{title}</span>
                  <span className="text-[10px] font-mono" style={{ color: '#8a8c98' }}>{sub}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden sm:block" style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.06)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
