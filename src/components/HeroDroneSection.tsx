import React from 'react';
import { RESORT_IMAGES } from '../data/resortData';
import {
  Sparkles,
  Compass,
  ArrowDown,
  Play,
  Eye,
  Waves,
  Sun,
  Shield,
  Clock,
} from 'lucide-react';

interface HeroDroneSectionProps {
  onExplore360: () => void;
  onCheckAvailability: () => void;
}

export const HeroDroneSection: React.FC<HeroDroneSectionProps> = ({
  onExplore360,
  onCheckAvailability,
}) => {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background High-Impact Drone Visual Carrier */}
      <div className="absolute inset-0 z-0">
        <img
          src={RESORT_IMAGES.droneAerial}
          alt="Tripura Lagoon Resort Drone Aerial View"
          className="w-full h-full object-cover scale-105 animate-pulse duration-[12000ms]"
        />
        {/* Measured Scrim for Typographic Legibility (WCAG AA Compliance) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Editorial Pill Kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/40 backdrop-blur-md mb-6 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
            Telangana's Iconic Mini Maldives
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-300 font-medium">Near Chilkur Balaji & Shankarpally</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-luxury font-bold text-white tracking-tight leading-[1.1] max-w-4xl text-balance">
          Luxury Waterfront Cottages Encircled by Serene Waters
        </h1>

        {/* Concrete Value Proposition */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed">
          Unwind in authentic overwater wooden villas built around a 3-acre sparkling turquoise
          lagoon. Experience sunset dining at Oasis, majestic celebrations at Vedika, and 360° virtual tours.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onCheckAvailability}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            Check Room Availability
          </button>

          <button
            onClick={onExplore360}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-sm border border-slate-700 backdrop-blur-md shadow-xl hover:border-amber-400/60 transition-all"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Launch 360° Panorama Tour</span>
          </button>
        </div>

        {/* Proof of Quality KPI Strip */}
        <div className="mt-14 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-left">
          <div className="border-r border-slate-800/60 pr-3">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Architecture
            </span>
            <div className="text-xl md:text-2xl font-extrabold text-white mt-0.5">16 Cottages</div>
            <p className="text-[11px] text-slate-400">Overwater teak sun decks</p>
          </div>

          <div className="border-r border-slate-800/60 pr-3">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Water Lagoon
            </span>
            <div className="text-xl md:text-2xl font-extrabold text-white mt-0.5">3 Acres</div>
            <p className="text-[11px] text-slate-400">Boating & kayaking marina</p>
          </div>

          <div className="border-r border-slate-800/60 pr-3">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Fine Dining
            </span>
            <div className="text-xl md:text-2xl font-extrabold text-white mt-0.5">Oasis Deck</div>
            <p className="text-[11px] text-slate-400">Fresh grill & mocktail bar</p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Conventions
            </span>
            <div className="text-xl md:text-2xl font-extrabold text-white mt-0.5">800 Guests</div>
            <p className="text-[11px] text-slate-400">Vedika AC hall & grand lawns</p>
          </div>
        </div>
      </div>
    </section>
  );
};
