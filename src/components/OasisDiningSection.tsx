import React, { useState } from 'react';
import { RESORT_IMAGES, OASIS_MENU_ITEMS } from '../data/resortData';
import { TableReservation, DiningZone, MealSlot } from '../types';
import {
  UtensilsCrossed,
  Clock,
  Sparkles,
  Wine,
  Calendar,
  Check,
  ChevronRight,
  Flame,
  Coffee,
} from 'lucide-react';

interface OasisDiningSectionProps {
  reservations: TableReservation[];
  onNewReservation: (res: TableReservation) => void;
  onOpenPanoramaScene: (sceneId: string) => void;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

export const OasisDiningSection: React.FC<OasisDiningSectionProps> = ({
  reservations,
  onNewReservation,
  onOpenPanoramaScene,
  isModalOpen = false,
  onCloseModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [onlyVeg, setOnlyVeg] = useState<boolean>(false);

  // Form State
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [reservationDate, setReservationDate] = useState<string>('2026-11-20');
  const [slot, setSlot] = useState<MealSlot>('DINNER');
  const [time, setTime] = useState<string>('19:30');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [zone, setZone] = useState<DiningZone>('LAGOON_DECK');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const showModal = isModalOpen || internalModalOpen;
  const handleClose = () => {
    setInternalModalOpen(false);
    setConfirmedReservation(null);
    if (onCloseModal) onCloseModal();
  };

  const categories = ['All', 'Starters & Grills', 'Regional Specialties', 'Coastal Catch', 'Mocktails & Chillers'];

  const filteredMenu = OASIS_MENU_ITEMS.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (onlyVeg && !item.isVeg) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newReservation: TableReservation = {
        id: `tbl-${Date.now()}`,
        reservationRef: `OASIS-${Math.floor(2000 + Math.random() * 8000)}`,
        guestName,
        guestEmail,
        guestPhone,
        reservationDate,
        slot,
        time,
        guestCount,
        zone,
        specialNotes,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      onNewReservation(newReservation);
      setConfirmedReservation(newReservation);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <section id="dining" className="w-full py-16 bg-slate-900/40 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Oasis Multi-Cuisine Dining</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Lagoon Overwater Restaurant & Bar</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
              Culinary Art Over Rippling Waters
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
              Dine on candlelit teak decks beneath starry skies. Savor authentic Hyderabadi claypot
              curries, freshly caught lagoon grilled seafood, and handcrafted artisan mocktails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenPanoramaScene('oasis-restaurant')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <span>View Dining in 360°</span>
            </button>
            <button
              onClick={() => setInternalModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>
          </div>
        </div>

        {/* Feature Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
          <img
            src={RESORT_IMAGES.oasisRestaurant}
            alt="Oasis Restaurant Ambience"
            className="w-full h-80 md:h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 md:p-10">
            <div className="max-w-xl">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                Evening Candlelit Seating Available Daily
              </span>
              <h3 className="text-2xl md:text-4xl font-serif-luxury font-bold text-white mt-2">
                Sunset Dining at the Water Pergola
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2">
                Open from 7:00 AM to 11:30 PM. Live acoustic instrumental melodies accompany dinner
                every Friday, Saturday, and Sunday.
              </p>
            </div>
          </div>
        </div>

        {/* Digital Interactive Menu Showcase */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Chef's Signature Digital Menu</h3>
              <p className="text-xs text-slate-400">Curated dishes crafted with organic local spices</p>
            </div>

            {/* Category Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setOnlyVeg(!onlyVeg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  onlyVeg
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                🌱 Veg Only
              </button>

              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      activeCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                          item.isVeg ? 'border-emerald-500' : 'border-red-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    </div>
                    <span className="font-mono text-sm font-bold text-amber-400">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.isChefSpecial && (
                  <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chef's Signature Recommendation</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Table Booking Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg my-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 text-white shadow-2xl">
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>

              {confirmedReservation ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                    Table Reserved
                  </span>
                  <h3 className="text-2xl font-serif-luxury font-bold text-white mt-1">
                    See You at Oasis Restaurant
                  </h3>
                  <p className="text-xs text-slate-300 mt-2">
                    Your table reference is{' '}
                    <span className="font-mono font-bold text-amber-400">
                      {confirmedReservation.reservationRef}
                    </span>
                    . We have held your seating on the {confirmedReservation.zone.replace('_', ' ')}.
                  </p>

                  <div className="my-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Dining Zone:</span>
                      <span className="font-bold text-white">
                        {confirmedReservation.zone === 'LAGOON_DECK'
                          ? 'Overwater Lagoon Deck'
                          : confirmedReservation.zone === 'POOLSIDE_CABANA'
                          ? 'Poolside Cabana'
                          : 'AC Glass Lounge'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Date & Slot:</span>
                      <span className="text-white">
                        {confirmedReservation.reservationDate} ({confirmedReservation.slot} · {confirmedReservation.time})
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Party Size:</span>
                      <span className="text-white">{confirmedReservation.guestCount} Guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Guest:</span>
                      <span className="text-white">{confirmedReservation.guestName}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                      Oasis Restaurant Reservation
                    </span>
                    <h3 className="text-2xl font-serif-luxury font-bold text-white mt-0.5">
                      Reserve Your Waterfront Table
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Complimentary table reservation with 15-minute grace period.
                    </p>
                  </div>

                  {/* Guest Contact */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Narendra Chennupati"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98490 00000"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Seating Zone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Select Seating Ambiance:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setZone('LAGOON_DECK')}
                        className={`p-2 rounded-xl border text-xs font-medium text-center transition ${
                          zone === 'LAGOON_DECK'
                            ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        🌊 Overwater Deck
                      </button>
                      <button
                        type="button"
                        onClick={() => setZone('POOLSIDE_CABANA')}
                        className={`p-2 rounded-xl border text-xs font-medium text-center transition ${
                          zone === 'POOLSIDE_CABANA'
                            ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        🌴 Poolside Cabana
                      </button>
                      <button
                        type="button"
                        onClick={() => setZone('AC_DINING')}
                        className={`p-2 rounded-xl border text-xs font-medium text-center transition ${
                          zone === 'AC_DINING'
                            ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        ❄️ AC Glass Lounge
                      </button>
                    </div>
                  </div>

                  {/* Date, Slot, Time, Party */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Date</label>
                      <input
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Meal Slot</label>
                      <select
                        value={slot}
                        onChange={(e) => setSlot(e.target.value as MealSlot)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white"
                      >
                        <option value="BREAKFAST">Breakfast</option>
                        <option value="LUNCH">Lunch</option>
                        <option value="HIGH_TEA">High Tea</option>
                        <option value="DINNER">Dinner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Time</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Guests</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Special Occasion / Dietary Notes</label>
                    <textarea
                      rows={2}
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. Anniversary candlelight arrangement, Jain food options, high chair needed..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Reserving Table...' : 'Confirm Table Reservation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
