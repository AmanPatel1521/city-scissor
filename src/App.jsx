import React, { useState } from 'react';
import PreHeroCutComb from './components/PreHeroCutComb';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustMetricsStrip from './components/TrustMetricsStrip';
import StreetViewLocation from './components/StreetViewLocation';
import ServicesAtelier from './components/ServicesAtelier';
import LookbookGallery from './components/LookbookGallery';
import MasterStylists from './components/MasterStylists';
import VIPTourExperience from './components/VIPTourExperience';
import ReviewsPress from './components/ReviewsPress';
import Footer from './components/Footer';
import BookingConcierge from './components/BookingConcierge';
import { audioManager } from './utils/audioManager';

export default function App() {
  const [introProgress, setIntroProgress] = useState(0);
  const [heroDwellProgress, setHeroDwellProgress] = useState(0);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('hc-master-sculpt');
  const [selectedStylistId, setSelectedStylistId] = useState('any');
  const [isAudioActive, setIsAudioActive] = useState(true);

  // Deterministic Audio Toggle
  const handleToggleAudio = () => {
    const nextState = !isAudioActive;
    if (nextState) {
      audioManager.unmute();
    } else {
      audioManager.mute();
    }
    setIsAudioActive(nextState);
    return nextState;
  };

  const handleOpenBooking = (serviceId = null, stylistId = null) => {
    if (serviceId) setSelectedServiceId(serviceId);
    if (stylistId) setSelectedStylistId(stylistId);
    setIsBookingOpen(true);
  };

  const handleExploreServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreLocation = () => {
    const el = document.getElementById('location');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // The Hero Section & Menus should only be visible after the pre-hero sequence completes
  const isSequenceFinished = introProgress >= 0.95 || isIntroDone;

  return (
    <div className="min-h-screen bg-[#070709] text-[#F8F8FA] selection:bg-[#D4AF37] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* 1. Pre-Hero 3D "Cut & Comb" Pure Visual 3D Sequence (Zero Text Clutter) */}
      <PreHeroCutComb
        onIntroProgress={(p, dwell) => {
          setIntroProgress(p);
          setHeroDwellProgress(dwell);
        }}
        onIntroComplete={() => setIsIntroDone(true)}
      />

      {/* 2. Glassmorphic Navigation Bar (Displayed strictly after prehero sequence ends) */}
      <div
        className="transition-opacity duration-700 ease-out"
        style={{
          opacity: isSequenceFinished ? 1 : 0,
          pointerEvents: isSequenceFinished ? 'auto' : 'none',
          visibility: isSequenceFinished ? 'visible' : 'hidden',
        }}
      >
        <Navbar
          onOpenBooking={() => handleOpenBooking()}
          isAudioActive={isAudioActive}
          onToggleAudio={handleToggleAudio}
        />
      </div>

      {/* 3. Main Content: Hero Section & Services */}
      <main
        className="w-full relative z-10 flex flex-col"
        style={{
          pointerEvents: isSequenceFinished ? 'auto' : 'none',
        }}
      >
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={handleExploreServices}
          onExploreLocation={handleExploreLocation}
        />

        {/* Heritage Trust & Metrics Strip */}
        <TrustMetricsStrip />

        {/* 4. Dedicated Ambawadi Studio Location & Dark City Map */}
        <StreetViewLocation />

        {/* 5. Signature Services Atelier Menu */}
        <ServicesAtelier
          onSelectService={(id) => setSelectedServiceId(id)}
          selectedServiceIds={[selectedServiceId]}
          onOpenBooking={() => handleOpenBooking(selectedServiceId)}
        />

        {/* 6. Interactive Before/After Lookbook Transformations */}
        <LookbookGallery
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 7. Master Stylists & Director Atelier */}
        <MasterStylists
          onSelectStylist={(id) => {
            setSelectedStylistId(id);
            handleOpenBooking(null, id);
          }}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 8. VIP Salon Amenities & Atmosphere Tour */}
        <VIPTourExperience onOpenBooking={() => handleOpenBooking()} />

        {/* 9. Ahmedabad Tastemaker Reviews & Press */}
        <ReviewsPress />
      </main>

      {/* 10. Luxury Footer */}
      <div
        className="transition-opacity duration-700 ease-out"
        style={{
          opacity: isSequenceFinished ? 1 : 0,
          pointerEvents: isSequenceFinished ? 'auto' : 'none',
          visibility: isSequenceFinished ? 'visible' : 'hidden',
        }}
      >
        <Footer onOpenBooking={() => handleOpenBooking()} />
      </div>

      {/* 11. Multi-Step Bespoke Booking Concierge Modal */}
      <BookingConcierge
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedServiceId={selectedServiceId}
        preselectedStylistId={selectedStylistId}
      />

    </div>
  );
}
