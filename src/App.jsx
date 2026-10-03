import React, { useState, lazy, Suspense } from 'react';
import PreHeroCutComb from './components/PreHeroCutComb';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustMetricsStrip from './components/TrustMetricsStrip';
import ServicesAtelier from './components/ServicesAtelier';
import MobileBottomBar from './components/MobileBottomBar';
import { audioManager } from './utils/audioManager';

// Code-split heavy off-screen sections & on-demand modal
const StreetViewLocation = lazy(() => import('./components/StreetViewLocation'));
const LookbookGallery = lazy(() => import('./components/LookbookGallery'));
const MasterStylists = lazy(() => import('./components/MasterStylists'));
const VIPTourExperience = lazy(() => import('./components/VIPTourExperience'));
const ReviewsPress = lazy(() => import('./components/ReviewsPress'));
const Footer = lazy(() => import('./components/Footer'));
const BookingConcierge = lazy(() => import('./components/BookingConcierge'));

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
  // Defer heavy offscreen media sections until intro begins or completes
  const shouldMountOffscreen = isSequenceFinished || introProgress > 0.05;

  return (
    <div className="min-h-screen bg-[#070709] text-[#F8F8FA] selection:bg-[#D4AF37] selection:text-black font-sans relative">
      
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
        {shouldMountOffscreen && (
          <Suspense fallback={<div className="w-full min-h-[300px]" />}>
            <StreetViewLocation />
          </Suspense>
        )}

        {/* 5. Signature Services Atelier Menu */}
        <ServicesAtelier
          onSelectService={(id) => setSelectedServiceId(id)}
          selectedServiceIds={[selectedServiceId]}
          onOpenBooking={() => handleOpenBooking(selectedServiceId)}
        />

        {/* 6. Interactive Before/After Lookbook Transformations & Media Sections */}
        {shouldMountOffscreen && (
          <Suspense fallback={<div className="w-full min-h-[300px]" />}>
            <LookbookGallery onOpenBooking={() => handleOpenBooking()} />
            <MasterStylists
              onSelectStylist={(id) => {
                setSelectedStylistId(id);
                handleOpenBooking(null, id);
              }}
              onOpenBooking={() => handleOpenBooking()}
            />
            <VIPTourExperience onOpenBooking={() => handleOpenBooking()} />
            <ReviewsPress />
          </Suspense>
        )}
      </main>

      {/* 10. Luxury Footer */}
      {shouldMountOffscreen && (
        <div
          className="transition-opacity duration-700 ease-out"
          style={{
            opacity: isSequenceFinished ? 1 : 0,
            pointerEvents: isSequenceFinished ? 'auto' : 'none',
            visibility: isSequenceFinished ? 'visible' : 'hidden',
          }}
        >
          <Suspense fallback={null}>
            <Footer onOpenBooking={() => handleOpenBooking()} />
          </Suspense>
        </div>
      )}

      {/* 11. Mobile Sticky Action Bar */}
      {isSequenceFinished && !isBookingOpen && (
        <MobileBottomBar onOpenBooking={() => handleOpenBooking()} />
      )}

      {/* 12. Multi-Step Bespoke Booking Concierge Modal (Loaded on-demand) */}
      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingConcierge
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            preselectedServiceId={selectedServiceId}
            preselectedStylistId={selectedStylistId}
          />
        </Suspense>
      )}

    </div>
  );
}
