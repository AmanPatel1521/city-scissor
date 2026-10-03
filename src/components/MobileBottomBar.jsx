import React from 'react';
import { Phone, Scissors, Calendar } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

export default function MobileBottomBar({ onOpenBooking }) {
  return (
    <aside
      aria-label="Mobile quick actions"
      className="sm:hidden fixed bottom-3 inset-x-3 z-40 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="bg-[#0c0c14]/95 backdrop-blur-xl border border-[#D4AF37]/35 rounded-2xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.9)] flex items-center justify-between gap-2">
        {/* Call Salon Button */}
        <a
          href="tel:+917948921100"
          onClick={() => audioManager.playClick()}
          className="flex-1 py-3 px-3 rounded-xl border border-[#D4AF37]/30 bg-[#14141e] text-[#F4E295] flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Call Salon</span>
        </a>

        {/* Reserve Appointment Button */}
        <button
          onClick={() => {
            audioManager.playScissorSnip();
            onOpenBooking();
          }}
          className="flex-1 py-3 px-3 rounded-xl btn-gold text-black flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-transform cursor-pointer"
        >
          <Scissors className="w-3.5 h-3.5 text-black" />
          <span>Reserve Slot</span>
        </button>
      </div>
    </aside>
  );
}
