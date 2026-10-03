import React, { useState, useRef, useEffect } from 'react';
import { lookbookTransformations } from '../data/lookbookData';
import { Sparkles, SlidersHorizontal, Scissors, MoveHorizontal } from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import { useGSAPReveal } from '../hooks/useGSAPReveal';

export default function LookbookGallery({ onOpenBooking }) {
  const [activeTransIndex, setActiveTransIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isDraggingRef = useRef(false);
  const sliderContainerRef = useRef(null);

  const headerRef = useGSAPReveal('up', 0);
  const tabsRef   = useGSAPReveal('up', 100);
  const sliderRef = useGSAPReveal('scale', 200);
  const detailRef = useGSAPReveal('up', 300);

  const currentTrans = lookbookTransformations[activeTransIndex];

  const handleMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleMouseDown = () => { isDraggingRef.current = true; };
  const handleMouseUp   = () => { isDraggingRef.current = false; };
  const handleMouseMove = (e) => { if (isDraggingRef.current) handleMove(e.clientX); };
  const handleTouchMove = (e) => { handleMove(e.touches[0].clientX); setHasInteracted(true); };

  return (
    <section id="lookbook" className="w-full py-24 lg:py-32 px-5 sm:px-10 lg:px-16 bg-[#0a0a0f]" style={{ borderTop: '1px solid rgba(212,175,55,0.15)', overflow: 'hidden' }}>

      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div ref={headerRef} className="reveal flex flex-col items-center text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] font-mono font-semibold mb-4" style={{ color: '#D4AF37' }}>
            Transformations & Lookbook
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            The Art of the <span className="gold-gradient-text">Transformation</span>
          </h2>
          <div className="w-16 h-px mx-auto mb-4"
            style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
          <p className="font-cormorant italic text-lg sm:text-xl max-w-xl mx-auto text-center leading-relaxed" style={{ color: '#9C9EA9' }}>
            Drag the golden divider to witness the dramatic contrast before and after our precision scissors and colour alchemy.
          </p>
        </div>

        {/* ── Case Study Tabs ── */}
        <div ref={tabsRef} className="reveal flex justify-center mb-16">
          <div className="inline-flex p-1.5 rounded-2xl gap-1.5" style={{ background: '#121220', border: '1px solid rgba(255,255,255,0.08)' }}>
            {lookbookTransformations.map((trans, idx) => (
              <button
                key={trans.id}
                onClick={() => {
                  audioManager.playClick();
                  setActiveTransIndex(idx);
                  setSliderPos(50);
                  setHasInteracted(false);
                }}
                className="px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer"
                style={
                  activeTransIndex === idx
                    ? { background: '#D4AF37', color: '#070709', fontWeight: '700', boxShadow: '0 2px 12px rgba(212,175,55,0.4)' }
                    : { color: '#9C9EA9', background: 'transparent' }
                }
              >
                {trans.title.split(' & ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Interactive Slider ── */}
        <div ref={sliderRef} className="reveal reveal-scale max-w-4xl mx-auto">
          <div
            ref={sliderContainerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setHasInteracted(true)}
            className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-2xl cursor-ew-resize select-none bg-[#111116]"
          >
            {/* After Image (full width base) */}
            <img
              src={currentTrans.afterImg}
              alt={`${currentTrans.title} After`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* After Label */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-[#070709]/90 backdrop-blur-md border border-[#D4AF37] shadow-lg">
              <span className="text-[9px] font-bold text-[#F4E295] uppercase font-mono tracking-widest">After</span>
            </div>

            {/* Before Image (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={currentTrans.beforeImg}
                alt={`${currentTrans.title} Before`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover "
                style={{
                  width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%',
                  maxWidth: 'none',
                }}
              />
              {/* Before Label */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-[#070709]/90 backdrop-blur-md border border-white/20 shadow-lg">
                <span className="text-[9px] font-semibold text-[#9C9EA9] uppercase font-mono tracking-widest">Before</span>
              </div>
            </div>

            {/* Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#D4AF37] z-30 shadow-[0_0_14px_rgba(212,175,55,0.7)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#070709] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)] flex items-center justify-center text-[#D4AF37]">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Drag hint — fades once interacted */}
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-7 pointer-events-none transition-opacity duration-700"
              style={{ opacity: hasInteracted ? 0 : 1 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#070709]/85 backdrop-blur-md border border-white/12">
                <MoveHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] font-mono text-[#C0C2C9] uppercase tracking-widest">Drag to compare</span>
              </div>
            </div>
          </div>

          {/* ── Detail Panel ── */}
          <div ref={detailRef} className="reveal mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 sm:px-12 sm:py-10 rounded-2xl bg-[#121218] border border-white/8">
            <div className="flex-1">
              <h3 className="font-cinzel text-base font-bold text-white mb-1">{currentTrans.title}</h3>
              <p className="text-base text-[#9C9EA9] leading-relaxed">{currentTrans.description}</p>
            </div>
            <button
              onClick={() => {
                audioManager.playScissorSnip();
                onOpenBooking();
              }}
              className="btn-gold px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2.5 cursor-pointer shrink-0 shadow-lg"
            >
              <Scissors className="w-4 h-4 text-black shrink-0" />
              <span>Replicate This Look</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
