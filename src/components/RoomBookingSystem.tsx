import React, { useState } from 'react';
import { RoomType, RoomBooking, PhysicalRoom } from '../types';
import {
  Calendar,
  Users,
  Bed,
  Maximize,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Eye,
  Check,
  Coffee,
  Waves,
} from 'lucide-react';

interface RoomBookingSystemProps {
  roomTypes: RoomType[];
  physicalRooms: PhysicalRoom[];
  bookings: RoomBooking[];
  onNewBooking: (booking: RoomBooking) => void;
  onOpenPanoramaScene: (sceneId: string) => void;
  selectedRoomSlug?: string | null;
}

export const RoomBookingSystem: React.FC<RoomBookingSystemProps> = ({
  roomTypes,
  physicalRooms,
  bookings,
  onNewBooking,
  onOpenPanoramaScene,
  selectedRoomSlug,
}) => {
  // Search parameters
  const [checkIn, setCheckIn] = useState<string>('2026-11-20');
  const [checkOut, setCheckOut] = useState<string>('2026-11-22');
  const [guestCount, setGuestCount] = useState<number>(2);

  // Active room for booking modal
  const [bookingModalRoom, setBookingModalRoom] = useState<RoomType | null>(null);

  // Booking form details
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY_UPI' | 'CREDIT_CARD' | 'PAY_AT_CHECKIN'>('RAZORPAY_UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<RoomBooking | null>(null);

  // Image gallery selected index per room card
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});

  // Compute available room count per room type
  const getAvailableCount = (typeId: string) => {
    const totalPhysical = physicalRooms.filter(
      (r) => r.roomTypeId === typeId && !r.isBlocked
    ).length;

    // Filter overlapping bookings
    const overlapping = bookings.filter((b) => {
      if (b.roomTypeId !== typeId || b.status === 'CANCELLED') return false;
      const bIn = new Date(b.checkInDate).getTime();
      const bOut = new Date(b.checkOutDate).getTime();
      const sIn = new Date(checkIn).getTime();
      const sOut = new Date(checkOut).getTime();
      return bIn < sOut && bOut > sIn;
    }).length;

    return Math.max(0, totalPhysical - overlapping);
  };

  // Calculate nights
  const calculateNights = () => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    return isNaN(diff) || diff <= 0 ? 1 : diff;
  };

  const nights = calculateNights();

  // Add-ons list
  const ADD_ON_OPTIONS = [
    { id: 'candlelight', name: 'Lagoon Overwater Candlelight Dinner', price: 3499 },
    { id: 'airport', name: 'Airport / City Chauffeur Pickup & Drop', price: 2199 },
    { id: 'bbq', name: 'Private Sunset Lawn Barbecue Setup', price: 2899 },
  ];

  const toggleAddOn = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const calculateTotal = (room: RoomType) => {
    const base = room.basePrice * nights;
    const addOnTotal = selectedAddOns.reduce((acc, currName) => {
      const match = ADD_ON_OPTIONS.find((o) => o.name === currName);
      return acc + (match ? match.price : 0);
    }, 0);
    const subtotal = base + addOnTotal;
    const gst = Math.round(subtotal * 0.12); // 12% luxury resort GST
    return { subtotal, gst, total: subtotal + gst };
  };

  // Open booking modal
  const handleOpenBooking = (room: RoomType) => {
    setBookingModalRoom(room);
    setConfirmedBooking(null);
  };

  // Submit booking
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalRoom) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const { total } = calculateTotal(bookingModalRoom);
      const assignedRoom = physicalRooms.find(
        (r) => r.roomTypeId === bookingModalRoom.id && !r.isBlocked
      );

      const newBooking: RoomBooking = {
        id: `bk-${Date.now()}`,
        bookingRef: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
        guestName,
        guestEmail,
        guestPhone,
        roomTypeId: bookingModalRoom.id,
        roomTypeName: bookingModalRoom.name,
        roomNumber: assignedRoom ? assignedRoom.roomNumber : undefined,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        guestsCount: guestCount,
        totalAmount: total,
        status: 'CONFIRMED',
        source: 'WEBSITE_DIRECT',
        addOns: selectedAddOns,
        createdAt: new Date().toISOString(),
      };

      onNewBooking(newBooking);
      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section id="accommodations" className="w-full py-16 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              <Bed className="w-4 h-4" />
              <span>Luxury Accommodations</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Overwater Cottages & Villas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
              Wake Up Suspended Over Serene Waters
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
              Inspired by tropical island architecture. Every cottage is crafted with natural teak
              wood, panoramic glass walls, and private sundecks directly overlooking the lagoon.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Direct Website Guarantee: Best Rate + Free Boating Pass</span>
          </div>
        </div>

        {/* Live Availability Bar */}
        <div className="mb-12 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Check-In Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Check-Out Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Guests
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                <option value={1}>1 Guest (Solo Retreat)</option>
                <option value={2}>2 Guests (Couple)</option>
                <option value={4}>4 Guests (Family Suite)</option>
                <option value={6}>6 Guests (Private Villa)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-full text-center px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
                <span className="text-amber-400 font-bold">{nights}</span> Night
                {nights > 1 ? 's' : ''} Stay
              </div>
            </div>
          </div>
        </div>

        {/* Room Catalog Cards */}
        <div className="space-y-12">
          {roomTypes.map((room) => {
            const available = getAvailableCount(room.id);
            const currentImgIdx = activeImageIndex[room.id] || 0;
            const isSelected = selectedRoomSlug === room.slug;

            return (
              <div
                key={room.id}
                className={`relative rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 shadow-amber-500/10 shadow-2xl bg-slate-900/90 ring-1 ring-amber-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                  {/* Photo Gallery Column (Col 5) */}
                  <div className="lg:col-span-5 relative flex flex-col justify-between p-4 bg-slate-950/60">
                    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-800">
                      <img
                        src={room.images[currentImgIdx] || room.images[0]}
                        alt={room.name}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur text-xs font-semibold text-amber-400 border border-white/10">
                        {room.viewType}
                      </div>

                      {/* 360 Panorama Tour Shortcut */}
                      <button
                        onClick={() => onOpenPanoramaScene(room.panoramaSceneId)}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur border border-amber-400/50 shadow-lg hover:scale-105 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>View in 360°</span>
                      </button>
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                      {room.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setActiveImageIndex((prev) => ({ ...prev, [room.id]: idx }))
                          }
                          className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                            currentImgIdx === idx
                              ? 'border-amber-400 scale-105'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Room Details & Pricing Column (Col 7) */}
                  <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                            {room.subtitle}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-serif-luxury font-bold text-white mt-0.5">
                            {room.name}
                          </h3>
                        </div>

                        {/* Availability Pill */}
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              available > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                available > 0 ? 'bg-emerald-400' : 'bg-red-400'
                              }`}
                            />
                            {available > 0
                              ? `${available} Units Available`
                              : 'Sold Out for Dates'}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                        {room.description}
                      </p>

                      {/* Key Room Specs */}
                      <div className="mt-5 grid grid-cols-3 gap-3 py-3 border-y border-slate-800 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Maximize className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{room.sizeSqFt} sq.ft</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Bed className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="truncate">{room.bedType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Users className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Up to {room.capacity} Guests</span>
                        </div>
                      </div>

                      {/* Amenities Grid */}
                      <div className="mt-5">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                          Included In Every Stay:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                          {room.amenities.map((amenity, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-white">
                            ₹{room.basePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400">/ night + GST</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Total for {nights} night{nights > 1 ? 's' : ''}:{' '}
                          <span className="text-white font-semibold">
                            ₹{(room.basePrice * nights).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenBooking(room)}
                          disabled={available <= 0}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                        >
                          <span>Reserve Direct</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Booking Modal */}
        {bookingModalRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl my-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 text-white shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setBookingModalRoom(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>

              {confirmedBooking ? (
                /* Success Confirmation Pass */
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                    Reservation Confirmed
                  </span>
                  <h3 className="text-2xl font-serif-luxury font-bold text-white mt-1">
                    Welcome to Tripura Lagoon Resort
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
                    Your booking reference is{' '}
                    <span className="font-mono font-bold text-amber-400">
                      {confirmedBooking.bookingRef}
                    </span>
                    . We have emailed the confirmation itinerary and check-in pass.
                  </p>

                  <div className="my-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Accommodation:</span>
                      <span className="font-bold text-white">{confirmedBooking.roomTypeName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Assigned Unit:</span>
                      <span className="font-bold text-amber-400">{confirmedBooking.roomNumber || 'Pre-Allocated'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Stay Duration:</span>
                      <span className="text-white">
                        {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights} Nights)
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Primary Guest:</span>
                      <span className="text-white">{confirmedBooking.guestName}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Total Amount (Inc. GST):</span>
                      <span className="font-extrabold text-amber-400 text-sm">
                        ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingModalRoom(null)}
                    className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
                  >
                    Done & Return to Resort Guide
                  </button>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleConfirmReservation} className="space-y-5">
                  <div>
                    <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                      Direct Reservation Checkout
                    </span>
                    <h3 className="text-2xl font-serif-luxury font-bold text-white mt-0.5">
                      {bookingModalRoom.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {nights} Night{nights > 1 ? 's' : ''} ({checkIn} to {checkOut}) · {guestCount} Guests
                    </p>
                  </div>

                  {/* Guest Contact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Narendra Chennupati"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="guest@example.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Phone (WhatsApp) *</label>
                      <input
                        required
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98490 00000"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Add-ons Experience Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Enhance Your Stay (Optional Add-Ons):
                    </label>
                    <div className="space-y-2">
                      {ADD_ON_OPTIONS.map((addon) => {
                        const isChecked = selectedAddOns.includes(addon.name);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.name)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                              isChecked
                                ? 'border-amber-500 bg-amber-500/10 text-white'
                                : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 text-xs">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="accent-amber-500 rounded"
                              />
                              <span className="font-medium">{addon.name}</span>
                            </div>
                            <span className="text-xs font-bold text-amber-400">
                              +₹{addon.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Payment Mode:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition text-center ${
                          paymentMethod === 'RAZORPAY_UPI'
                            ? 'border-amber-500 bg-amber-500/20 text-white'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        UPI / QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CREDIT_CARD')}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition text-center ${
                          paymentMethod === 'CREDIT_CARD'
                            ? 'border-amber-500 bg-amber-500/20 text-white'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        Credit/Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PAY_AT_CHECKIN')}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition text-center ${
                          paymentMethod === 'PAY_AT_CHECKIN'
                            ? 'border-amber-500 bg-amber-500/20 text-white'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        Pay at Check-In
                      </button>
                    </div>
                  </div>

                  {/* Price Calculation Summary */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                    {(() => {
                      const { subtotal, gst, total } = calculateTotal(bookingModalRoom);
                      return (
                        <>
                          <div className="flex justify-between text-slate-400">
                            <span>Base Room Rate ({nights} Nights):</span>
                            <span>₹{(bookingModalRoom.basePrice * nights).toLocaleString('en-IN')}</span>
                          </div>
                          {selectedAddOns.length > 0 && (
                            <div className="flex justify-between text-slate-400">
                              <span>Selected Add-Ons ({selectedAddOns.length}):</span>
                              <span>
                                ₹
                                {selectedAddOns
                                  .reduce((acc, curr) => {
                                    const m = ADD_ON_OPTIONS.find((o) => o.name === curr);
                                    return acc + (m ? m.price : 0);
                                  }, 0)
                                  .toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-400">
                            <span>Hospitality GST (12%):</span>
                            <span>₹{gst.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-slate-800">
                            <span>Total Payable Amount:</span>
                            <span className="text-amber-400">₹{total.toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Submission */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition disabled:opacity-50"
                  >
                    {isSubmitting
                      ? 'Processing Secure Reservation...'
                      : paymentMethod === 'PAY_AT_CHECKIN'
                      ? 'Confirm Booking (Pay Later)'
                      : 'Pay & Confirm Reservation'}
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
