import React, { useState } from 'react';
import { RESORT_IMAGES } from '../data/resortData';
import {
  BanquetInquiry,
  EventType,
  BanquetVenue,
  CateringTier,
} from '../types';
import {
  Sparkles,
  Calendar,
  Users,
  Check,
  Building2,
  Clock,
  CheckCircle2,
  PhoneCall,
  Crown,
  Layers,
} from 'lucide-react';

interface VedikaBanquetSectionProps {
  inquiries: BanquetInquiry[];
  onNewInquiry: (inquiry: BanquetInquiry) => void;
  onOpenPanoramaScene: (sceneId: string) => void;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

export const VedikaBanquetSection: React.FC<VedikaBanquetSectionProps> = ({
  inquiries,
  onNewInquiry,
  onOpenPanoramaScene,
  isModalOpen = false,
  onCloseModal,
}) => {
  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [guests, setGuests] = useState<number>(350);
  const [venueChoice, setVenueChoice] = useState<BanquetVenue>('COMBINED');
  const [cateringTier, setCateringTier] = useState<CateringTier>('NON_VEG_DELUXE');

  // Contact form state
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('2026-12-18');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedInquiry, setConfirmedInquiry] = useState<BanquetInquiry | null>(null);

  // Per plate pricing
  const perPlateRates: Record<CateringTier, number> = {
    VEG_STANDARD: 1100,
    NON_VEG_DELUXE: 1250,
    PREMIUM_SEAFOOD_GRILL: 1600,
  };

  const perPlate = perPlateRates[cateringTier];
  const isHallWaived = guests >= 250;
  const venueBaseFee = isHallWaived
    ? 0
    : venueChoice === 'COMBINED'
    ? 50000
    : 35000;

  const estimatedCatering = guests * perPlate;
  const subtotal = estimatedCatering + venueBaseFee;
  const gst = Math.round(subtotal * 0.18); // 18% event service GST
  const grandTotal = subtotal + gst;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: BanquetInquiry = {
        id: `bnq-${Date.now()}`,
        inquiryRef: `VEDIKA-${Math.floor(8000 + Math.random() * 2000)}`,
        guestName,
        guestEmail,
        guestPhone,
        eventType,
        eventDate,
        expectedGuests: guests,
        venueChoice,
        cateringTier,
        estimatedTotal: grandTotal,
        notes,
        status: 'DATE_HOLD',
        createdAt: new Date().toISOString(),
      };

      onNewInquiry(newInquiry);
      setConfirmedInquiry(newInquiry);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <section id="banquets" className="w-full py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              <Crown className="w-4 h-4" />
              <span>Vedika Convention & Banquets</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Grand Weddings & Corporate Galas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
              A Majestic Stage for Lifetime Celebrations
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
              From fairy-tale destination weddings with lagoon firework reflections to high-profile
              executive corporate retreats. Capacity for up to 800+ guests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenPanoramaScene('vedika-banquet')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <span>View Ballroom in 360°</span>
            </button>
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
          <img
            src={RESORT_IMAGES.vedikaBanquet}
            alt="Vedika Convention Center"
            className="w-full h-80 md:h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 md:p-10">
            <div className="max-w-xl">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                Complimentary Hall Rent on 250+ Guests
              </span>
              <h3 className="text-2xl md:text-4xl font-serif-luxury font-bold text-white mt-2">
                Indoor Air-Conditioned Hall & Expansive Lawns
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2">
                Features crystal chandeliers, bridal green rooms, integrated line-array audio, and
                valet parking for over 300 vehicles.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Event Budget Calculator & Date Hold Form */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-10 shadow-2xl backdrop-blur-md">
          {confirmedInquiry ? (
            <div className="text-center py-8 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Date Hold Requested
              </span>
              <h3 className="text-2xl font-serif-luxury font-bold text-white mt-1">
                Your Event Quotation is Generated
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Inquiry Ref:{' '}
                <span className="font-mono font-bold text-amber-400">
                  {confirmedInquiry.inquiryRef}
                </span>
                . Our Senior Banquet Sales Manager has received your requested date hold for{' '}
                <span className="text-white font-semibold">{confirmedInquiry.eventDate}</span>.
              </p>

              <div className="my-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Occasion:</span>
                  <span className="font-bold text-white">{confirmedInquiry.eventType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Guest Count:</span>
                  <span className="text-white">{confirmedInquiry.expectedGuests} Guests</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Venue Choice:</span>
                  <span className="text-white">{confirmedInquiry.venueChoice.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Estimated Budget (Inc. GST):</span>
                  <span className="font-extrabold text-amber-400 text-sm">
                    ₹{confirmedInquiry.estimatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setConfirmedInquiry(null)}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
              >
                Create Another Quotation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Real-Time Quotation & Date Hold Calculator</span>
                </div>
                <h3 className="text-2xl font-serif-luxury font-bold text-white mt-1">
                  Configure Your Celebration Package
                </h3>
              </div>

              {/* Calculator Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Event Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="WEDDING">Grand Wedding & Reception</option>
                    <option value="HALDI_SANGEET">Haldi / Sangeet Ceremony</option>
                    <option value="CORPORATE_OFFSITE">Corporate Offsite & Seminar</option>
                    <option value="BIRTHDAY_GALA">Family Birthday / Half-Saree Gala</option>
                  </select>
                </div>

                {/* Venue Choice */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Venue Choice
                  </label>
                  <select
                    value={venueChoice}
                    onChange={(e) => setVenueChoice(e.target.value as BanquetVenue)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="INDOOR_AC">Vedika AC Hall (Up to 300 Pax)</option>
                    <option value="OPEN_LAWN">Grand Open Lawns (Up to 600 Pax)</option>
                    <option value="COMBINED">Combined Hall + Lawns (800+ Pax)</option>
                  </select>
                </div>

                {/* Catering Tier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Catering Buffet Tier
                  </label>
                  <select
                    value={cateringTier}
                    onChange={(e) => setCateringTier(e.target.value as CateringTier)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="VEG_STANDARD">Pure Veg Royal Feast (₹1,100 / plate)</option>
                    <option value="NON_VEG_DELUXE">Multi-Cuisine Deluxe (₹1,250 / plate)</option>
                    <option value="PREMIUM_SEAFOOD_GRILL">Seafood & Tandoori BBQ (₹1,600 / plate)</option>
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Target Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                  </input>
                </div>
              </div>

              {/* Guest Count Slider */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Expected Number of Guests:
                  </span>
                  <span className="font-mono text-xl font-extrabold text-amber-400 tabular-nums">
                    {guests} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="25"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500 bg-slate-700"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>50 (Intimate)</span>
                  <span>250 (Hall Free Threshold)</span>
                  <span>500</span>
                  <span>800+ (Grand Estate)</span>
                </div>
              </div>

              {/* Live Quotation Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 items-center">
                <div className="md:col-span-7 space-y-1 text-xs">
                  <span className="text-amber-400 uppercase tracking-wider font-semibold">
                    Instant Estimated Budget (Before GST)
                  </span>
                  <div className="text-3xl md:text-4xl font-extrabold text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-slate-300">
                    Catering ({guests} × ₹{perPlate}):{' '}
                    <span className="font-semibold text-white">
                      ₹{estimatedCatering.toLocaleString('en-IN')}
                    </span>
                    {' · '}
                    Hall Charge:{' '}
                    {isHallWaived ? (
                      <span className="text-emerald-400 font-bold">
                        COMPLIMENTARY (Waived for 250+ guests!)
                      </span>
                    ) : (
                      <span className="text-white font-semibold">
                        ₹{venueBaseFee.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Estimated Grand Total with 18% GST: ₹{grandTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Contact Inputs */}
                <div className="md:col-span-5 space-y-3">
                  <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Hold Date & Request Contract:
                  </span>
                  <input
                    required
                    type="text"
                    placeholder="Organizer / Host Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2 text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="tel"
                      placeholder="WhatsApp Mobile"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2 text-xs text-white"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-2 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Holding Date...' : 'Hold Date & Send Formal Quote'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
