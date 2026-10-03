import React, { useState } from 'react';
import { servicesData } from '../data/servicesData';
import { stylistsData } from '../data/stylistsData';
import {
  X,
  Check,
  Scissors,
  Calendar,
  Clock,
  User,
  Coffee,
  Sparkles,
  Download,
  Phone,
  MapPin,
  ChevronRight,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CityScissorLogo from './CityScissorLogo';
import { audioManager } from '../utils/audioManager';

export default function BookingConcierge({
  isOpen,
  onClose,
  preselectedServiceId,
  preselectedStylistId,
}) {
  const [step, setStep] = useState(1); // 1: Services, 2: Stylist, 3: Date & Slot, 4: VIP Details, 5: Confirmation
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // Form state
  const [selectedServices, setSelectedServices] = useState(
    preselectedServiceId ? [preselectedServiceId] : ['hc-master-sculpt']
  );
  const [selectedStylist, setSelectedStylist] = useState(preselectedStylistId || 'any');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, Sun 16 Aug');
  const [selectedTime, setSelectedTime] = useState('04:30 PM');

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [stylingNotes, setStylingNotes] = useState('');
  const [silentAppointment, setSilentAppointment] = useState(false);
  const [beverage, setBeverage] = useState('Single-Origin Ethiopian Pour-Over');
  const [bookingPassCode, setBookingPassCode] = useState('');

  if (!isOpen) return null;

  // Category filter tabs
  const categoryTabs = [
    { id: 'all', label: 'All Services' },
    { id: 'haircut', label: 'Haircuts' },
    { id: 'color', label: 'Balayage & Color' },
    { id: 'rituals', label: 'Keratin & Botox' },
    { id: 'couture', label: 'VIP Suites' },
  ];

  const filteredServices =
    activeCategoryFilter === 'all'
      ? servicesData
      : servicesData.filter((s) => s.category === activeCategoryFilter);

  // Toggle service selection
  const handleToggleService = (id) => {
    audioManager.playClick();
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // Selected entities calculations
  const chosenServices = servicesData.filter((s) => selectedServices.includes(s.id));
  const totalPrice = chosenServices.reduce((acc, curr) => acc + curr.price, 0);
  const chosenStylistObj = stylistsData.find((st) => st.id === selectedStylist);

  // Generate dynamic .ics Calendar Invite
  const handleDownloadCalendar = () => {
    audioManager.playClick();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//City Scissor Unisex Salon//Ambawadi Ahmedabad//EN
BEGIN:VEVENT
SUMMARY:Haute Appointment at City Scissor Salon (Ambawadi)
DESCRIPTION:Your bespoke salon ritual: ${chosenServices.map((s) => s.title).join(', ')}. Stylist: ${chosenStylistObj ? chosenStylistObj.name : 'First Available Master'}. Ref: ${bookingPassCode}
LOCATION:Main Road, Opp. BRTS Bus Stop, Ambawadi, Ahmedabad 380006
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CityScissor-Appointment-${bookingPassCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Booking
  const handleFinalizeBooking = (e) => {
    if (e) e.preventDefault();
    if (!guestName || !guestPhone) {
      alert('Please provide your full name and phone number to confirm your reservation.');
      return;
    }

    audioManager.playScissorSnip(1.1);
    const passCode = `CS-AMB-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingPassCode(passCode);
    setStep(5);

    // Fire celebratory gold & champagne confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F4E295', '#C98993', '#FFFFFF'],
      });
    } catch (err) {}
  };

  const nextDays = [
    { label: 'Today', date: 'Sat, 15 Aug', full: 'Today, Sat 15 Aug' },
    { label: 'Tomorrow', date: 'Sun, 16 Aug', full: 'Tomorrow, Sun 16 Aug' },
    { label: 'Tue', date: '18 Aug', full: 'Tue, 18 Aug' },
    { label: 'Wed', date: '19 Aug', full: 'Wed, 19 Aug' },
    { label: 'Thu', date: '20 Aug', full: 'Thu, 20 Aug' },
    { label: 'Fri', date: '21 Aug', full: 'Fri, 21 Aug' },
    { label: 'Sat', date: '22 Aug', full: 'Sat, 22 Aug' },
  ];

  const timeSlots = [
    { period: 'Morning (10:00 AM – 01:00 PM)', slots: ['10:30 AM', '11:15 AM', '12:00 PM'] },
    { period: 'Afternoon (01:00 PM – 05:00 PM)', slots: ['01:30 PM', '02:45 PM', '03:30 PM', '04:30 PM'] },
    { period: 'Evening (05:00 PM – 09:00 PM)', slots: ['05:45 PM', '06:30 PM', '07:15 PM', '08:00 PM'] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      
      {/* 2-Panel Haute Luxury Modal Shell */}
      <div className="relative w-full max-w-5xl rounded-2xl sm:rounded-3xl bg-[#0c0c12] border border-[#D4AF37]/45 shadow-[0_30px_100px_rgba(0,0,0,0.98)] overflow-hidden my-auto flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        
        {/* 1. Header Bar */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 bg-[#12121a] border-b border-[#D4AF37]/25 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <CityScissorLogo className="w-8 h-8 sm:w-9 sm:h-9" glow={false} />
            <div>
              <h3 className="font-cinzel text-sm sm:text-lg font-bold text-white tracking-wide">
                Bespoke Booking Concierge
              </h3>
              <span className="text-[11px] sm:text-xs text-[#E6CA65] font-mono">
                Opp. BRTS • Ambawadi Atelier
              </span>
            </div>
          </div>

          {/* Steps Indicator on Desktop with generous pill-tab size */}
          {step < 5 && (
            <div className="hidden md:flex items-center gap-3 font-mono text-xs">
              <span className={`pill-tab font-bold transition-all ${step === 1 ? 'bg-[#D4AF37] text-black shadow-md' : step > 1 ? 'text-[#F4E295] bg-[#D4AF37]/10' : 'bg-white/5 text-[#9C9EA9]'}`}>
                01 Rituals
              </span>
              <span className="text-white/20">/</span>
              <span className={`pill-tab font-bold transition-all ${step === 2 ? 'bg-[#D4AF37] text-black shadow-md' : step > 2 ? 'text-[#F4E295] bg-[#D4AF37]/10' : 'bg-white/5 text-[#9C9EA9]'}`}>
                02 Artist
              </span>
              <span className="text-white/20">/</span>
              <span className={`pill-tab font-bold transition-all ${step === 3 ? 'bg-[#D4AF37] text-black shadow-md' : step > 3 ? 'text-[#F4E295] bg-[#D4AF37]/10' : 'bg-white/5 text-[#9C9EA9]'}`}>
                03 Schedule
              </span>
              <span className="text-white/20">/</span>
              <span className={`pill-tab font-bold transition-all ${step === 4 ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-[#9C9EA9]'}`}>
                04 Guest
              </span>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[#C0C2C9] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close Concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Step Header with Progress Track */}
        {step < 5 && (
          <div className="md:hidden px-4 py-2.5 bg-[#0e0e16] border-b border-white/5 flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#D4AF37] font-bold">Step {step} of 4</span>
              <span className="text-[#C0C2C9]">
                {step === 1 ? 'Rituals' : step === 2 ? 'Artist' : step === 3 ? 'Schedule' : 'Details'}
              </span>
            </div>
            <div className="w-full h-1 bg-[#1a1a24] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4E295] transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 2. Main Two-Column Workspace */}
        {step < 5 ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-[#D4AF37]/20">
              
              {/* LEFT COLUMN: Interactive Step Configurator (7 Cols) */}
              <div className="lg:col-span-7 p-4 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto max-h-[58vh] sm:max-h-[62vh] lg:max-h-[72vh]">
              
              {/* STEP 1: Select Rituals / Services */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-cinzel text-xl font-bold text-white mb-1">
                        Select Your Rituals
                      </h4>
                      <p className="text-xs sm:text-sm text-[#9C9EA9]">
                        Combine multiple services for a complete haute transformation.
                      </p>
                    </div>
                  </div>

                  {/* Filter Tabs with generous pill-tab size */}
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {categoryTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          audioManager.playClick();
                          setActiveCategoryFilter(tab.id);
                        }}
                        className={`pill-tab focus-ring-luxury cursor-pointer transition-all ${
                          activeCategoryFilter === tab.id
                            ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                            : 'bg-[#181824] text-[#9C9EA9] hover:text-white border border-white/5'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Service Cards with Spacious Padding */}
                  <div className="space-y-3.5">
                    {filteredServices.map((s) => {
                      const isChecked = selectedServices.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleToggleService(s.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleToggleService(s.id);
                            }
                          }}
                          className={`p-4.5 sm:p-5 rounded-2xl border cursor-pointer transition-all focus-ring-luxury flex items-center justify-between gap-4 ${
                            isChecked
                              ? 'bg-[#181826] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.18)]'
                              : 'bg-[#121218] border-white/10 hover:border-[#D4AF37]/35 text-[#C0C2C9]'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-1 shrink-0 ${
                              isChecked ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/30 bg-white/5'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 text-black font-black" />}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                                <span className="text-sm sm:text-base font-bold text-white">{s.title}</span>
                                <span className="pill-tag bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-mono">
                                  {s.duration}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-[#9C9EA9] leading-relaxed line-clamp-1 sm:line-clamp-none">{s.subtitle}</p>
                            </div>
                          </div>

                          <span className="font-cinzel font-bold text-white text-base sm:text-lg shrink-0">
                            ₹{s.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Choose Stylist */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-cinzel text-xl font-bold text-white mb-1">
                      Pair with a Master Stylist
                    </h4>
                    <p className="text-xs sm:text-sm text-[#9C9EA9]">
                      Select your dedicated artist or let us assign the best available specialist.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Available Master */}
                    <div
                      onClick={() => {
                        audioManager.playClick();
                        setSelectedStylist('any');
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          audioManager.playClick();
                          setSelectedStylist('any');
                        }
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all focus-ring-luxury flex items-center gap-4 ${
                        selectedStylist === 'any'
                          ? 'bg-[#181826] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'bg-[#121218] border-white/10 hover:border-[#D4AF37]/35 text-[#C0C2C9]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#1f1f2c] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-bold text-white block">First Available Master</span>
                        <span className="text-xs text-[#9C9EA9]">Optimal schedule flexibility</span>
                      </div>
                    </div>

                    {/* Stylist Profiles */}
                    {stylistsData.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => {
                          audioManager.playClick();
                          setSelectedStylist(st.id);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            audioManager.playClick();
                            setSelectedStylist(st.id);
                          }
                        }}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all focus-ring-luxury flex items-center gap-4 ${
                          selectedStylist === st.id
                            ? 'bg-[#181826] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                            : 'bg-[#121218] border-white/10 hover:border-[#D4AF37]/35 text-[#C0C2C9]'
                        }`}
                      >
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#D4AF37]/30 shrink-0"
                        />
                        <div>
                          <span className="text-sm sm:text-base font-bold text-white block">{st.name}</span>
                          <span className="text-xs text-[#C98993] font-medium">{st.role}</span>
                          <span className="text-[11px] text-[#9C9EA9] block font-mono mt-0.5">{st.experience} Experience</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Date & Slot */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-cinzel text-xl font-bold text-white mb-1">
                      Select Preferred Date &amp; Time
                    </h4>
                    <p className="text-xs sm:text-sm text-[#9C9EA9]">
                      Salon hours: 10:00 AM – 9:00 PM (Valet active throughout).
                    </p>
                  </div>

                  {/* Date Pills */}
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#E6CA65] font-mono block mb-3 font-semibold">
                      Select Date
                    </span>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {nextDays.map((d) => (
                        <button
                          key={d.label}
                          onClick={() => {
                            audioManager.playClick();
                            setSelectedDate(d.full);
                          }}
                          className={`px-5 py-3.5 rounded-2xl focus-ring-luxury text-center min-w-[105px] border transition-all cursor-pointer shrink-0 ${
                            selectedDate === d.full
                              ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                              : 'bg-[#121218] border-white/10 text-[#C0C2C9] hover:text-white hover:border-[#D4AF37]/35'
                          }`}
                        >
                          <span className="text-xs uppercase font-mono block font-bold">{d.label}</span>
                          <span className="text-[11px] opacity-80">{d.date.split(', ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#E6CA65] font-mono block font-semibold">
                      Select Time Slot
                    </span>
                    {timeSlots.map((group, idx) => (
                      <div key={idx} className="space-y-2.5">
                        <span className="text-xs text-[#9C9EA9] font-mono block">{group.period}</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {group.slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => {
                                audioManager.playClick();
                                setSelectedTime(slot);
                              }}
                              className={`py-3 px-4 rounded-xl focus-ring-luxury text-xs sm:text-sm font-mono transition-all border cursor-pointer ${
                                selectedTime === slot
                                  ? 'bg-[#F4E295] text-black font-bold border-[#F4E295] shadow-[0_0_15px_#F4E295]'
                                  : 'bg-[#14141c] border-white/10 text-[#C0C2C9] hover:text-white hover:border-[#D4AF37]/35'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: VIP Guest Details (Spacious Form Controls & Text Boxes) */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-cinzel text-xl font-bold text-white mb-1">
                      VIP Guest Information
                    </h4>
                    <p className="text-xs sm:text-sm text-[#9C9EA9]">
                      We personalize every detail prior to your arrival at our Ambawadi atelier.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs text-[#E6CA65] block mb-2 font-semibold font-mono uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Yashvi Shah"
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#E6CA65] block mb-2 font-semibold font-mono uppercase tracking-wider">
                        Phone Number (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98980 00000"
                        className="input-luxury"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#E6CA65] block mb-2 font-semibold font-mono uppercase tracking-wider">
                      Email Address (For Calendar &amp; Receipt)
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="name@luxury.com"
                      className="input-luxury"
                    />
                  </div>

                  {/* Special Styling Requests / Hair Notes */}
                  <div>
                    <label className="text-xs text-[#E6CA65] flex items-center gap-2 mb-2 font-semibold font-mono uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Special Requests or Hair History (Optional)</span>
                    </label>
                    <textarea
                      value={stylingNotes}
                      onChange={(e) => setStylingNotes(e.target.value)}
                      placeholder="Tell us about your hair type, desired styling goal, or previous treatments..."
                      className="textarea-luxury"
                    />
                  </div>

                  {/* Complimentary Beverage Selector */}
                  <div>
                    <label className="text-xs text-[#E6CA65] flex items-center gap-2 mb-2 font-semibold font-mono uppercase tracking-wider">
                      <Coffee className="w-4 h-4 text-[#D4AF37]" />
                      <span>Complimentary Atelier Beverage</span>
                    </label>
                    <select
                      value={beverage}
                      onChange={(e) => setBeverage(e.target.value)}
                      className="select-luxury"
                    >
                      <option>Single-Origin Ethiopian Pour-Over</option>
                      <option>Double Espresso Cortado</option>
                      <option>Iced Kyoto Matcha Latte</option>
                      <option>Darjeeling First Flush Tea</option>
                      <option>Chilled Sparkling Water with Lime</option>
                    </select>
                  </div>

                  {/* Silent Appointment Checkbox */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSilentAppointment(!silentAppointment)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSilentAppointment(!silentAppointment);
                      }
                    }}
                    className="p-4 rounded-2xl bg-[#14141c] border border-white/10 flex items-center gap-3.5 cursor-pointer select-none focus-ring-luxury"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      silentAppointment ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/25 bg-white/5'
                    }`}>
                      {silentAppointment && <Check className="w-3.5 h-3.5 text-black font-black" />}
                    </div>
                    <div className="text-xs sm:text-sm">
                      <span className="text-white font-semibold block">Silent Appointment Protocol</span>
                      <span className="text-[#9C9EA9]">Zero small talk after consultation—pure quiet relaxation.</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Live Reservation Summary Ticket (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0f0f16] flex flex-col justify-between space-y-6" aria-live="polite">
              
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-mono font-bold">
                    Reservation Ticket
                  </span>
                  <span className="text-[10px] text-[#9C9EA9] font-mono">
                    Ambawadi Studio
                  </span>
                </div>

                {/* Selected Services breakdown */}
                <div className="space-y-2.5">
                  <span className="text-xs text-[#9C9EA9] font-mono uppercase block">Selected Ritual(s):</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {chosenServices.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-white font-medium truncate max-w-[200px]">{s.title}</span>
                        <span className="font-cinzel text-white font-bold ml-2">₹{s.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Metadata */}
                <div className="p-4.5 rounded-2xl bg-[#14141e] border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#9C9EA9]">Artist:</span>
                    <span className="text-[#F4E295] font-semibold">{chosenStylistObj ? chosenStylistObj.name : 'First Available Master'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9C9EA9]">Schedule:</span>
                    <span className="text-white font-medium">{selectedDate} @ {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9C9EA9]">Valet:</span>
                    <span className="text-emerald-400 font-semibold">Complimentary</span>
                  </div>
                </div>

                {/* Total Investment */}
                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#9C9EA9] font-mono">Total Investment:</span>
                  <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F4E295]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons (Desktop) */}
              <div className="space-y-3 pt-4 hidden lg:block">
                {step < 4 ? (
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setStep(step + 1);
                    }}
                    className="btn-gold pill-large w-full font-bold tracking-widest uppercase flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                  >
                    <span>
                      {step === 1 ? 'Proceed to Artist' : step === 2 ? 'Proceed to Schedule' : 'Proceed to Details'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-black shrink-0" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalizeBooking}
                    className="btn-gold pill-large w-full font-bold tracking-widest uppercase flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.45)]"
                  >
                    <Scissors className="w-4 h-4 text-black shrink-0" />
                    <span>Confirm Reservation</span>
                  </button>
                )}

                {step > 1 && (
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setStep(step - 1);
                    }}
                    className="btn-outline-gold pill-medium w-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Step</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Mobile Sticky Footer Action Bar (Fixed at bottom on phones) */}
          <div className="lg:hidden px-4 py-3 bg-[#101018]/98 border-t border-[#D4AF37]/30 flex items-center justify-between gap-3 shrink-0 z-20 backdrop-blur-lg">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-mono text-[#9C9EA9]">Estimated Total</span>
              <span className="font-cinzel text-base font-bold text-[#F4E295]">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={() => {
                    audioManager.playClick();
                    setStep(step - 1);
                  }}
                  className="px-3.5 py-2 rounded-full border border-white/20 text-xs font-mono text-[#C0C2C9] hover:text-white"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={() => {
                    audioManager.playClick();
                    setStep(step + 1);
                  }}
                  className="btn-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  <span>{step === 1 ? 'Artist' : step === 2 ? 'Schedule' : 'Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-black" />
                </button>
              ) : (
                <button
                  onClick={handleFinalizeBooking}
                  className="btn-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.45)]"
                >
                  <span>Confirm</span>
                  <Scissors className="w-3.5 h-3.5 text-black" />
                </button>
              )}
            </div>
          </div>
        </div>
        ) : (
          /* STEP 5: Final Confirmation Pass (Full Width) */
          <div className="p-6 sm:p-12 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto shadow-[0_0_35px_#D4AF37]">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#F4E295] animate-pulse" />
            </div>

            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-mono font-bold block mb-1">
                Haute Reservation Confirmed
              </span>
              <h3 className="font-cinzel text-xl sm:text-3xl font-bold text-white">
                Welcome to City Scissor, {guestName}
              </h3>
            </div>

            {/* Reservation Pass Card */}
            <div className="max-w-md mx-auto p-5 sm:p-6 rounded-3xl bg-[#14141e] border border-[#D4AF37]/40 text-left space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] text-[#9C9EA9] uppercase font-mono block">Pass Code</span>
                  <span className="font-mono text-base font-bold text-[#F4E295]">{bookingPassCode}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold">
                  CONFIRMED
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#C0C2C9]">
                <div className="flex justify-between">
                  <span className="text-[#9C9EA9]">Rituals:</span>
                  <span className="text-white font-medium text-right">{chosenServices.map((s) => s.title).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9C9EA9]">Schedule:</span>
                  <span className="text-white font-medium">{selectedDate} @ {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9C9EA9]">Stylist:</span>
                  <span className="text-white font-medium">{chosenStylistObj ? chosenStylistObj.name : 'First Available Master'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9C9EA9]">Beverage:</span>
                  <span className="text-white font-medium">{beverage}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                  <span className="text-white">Total Investment:</span>
                  <span className="text-[#D4AF37] font-cinzel text-base">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
              <button
                onClick={handleDownloadCalendar}
                className="btn-outline-gold pill-large w-full sm:w-auto font-bold tracking-wider uppercase cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <a
                href={`https://wa.me/917948921100?text=Hello%20City%20Scissor%2C%20I%20have%20booked%20an%20appointment%20with%20Pass%20Code%20${bookingPassCode}%20for%20${guestName}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold pill-large w-full sm:w-auto font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
              >
                <Phone className="w-4 h-4 text-black" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
