import React from 'react';
import { RESORT_IMAGES } from '../data/resortData';
import {
  Waves,
  Sun,
  Dices,
  Flame,
  Music,
  Coffee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AmenitiesSectionProps {
  onBookDayPass: () => void;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  onBookDayPass,
}) => {
  const AMENITIES = [
    {
      icon: Waves,
      title: 'Lagoon Boating & Kayaks',
      desc: 'Complimentary pedal boats and tandem kayaks to cruise across the 3-acre serene circular lagoon.',
    },
    {
      icon: Sun,
      title: 'Infinity Pool & Cabanas',
      desc: 'Curved tropical infinity pool with private daybed cabanas, shaded loungers, and dedicated towel concierge.',
    },
    {
      icon: Music,
      title: 'Rain Dance Floor & Music',
      desc: 'High-energy overhead mist showers and state-of-the-art surround sound for family celebrations.',
    },
    {
      icon: Dices,
      title: 'Indoor Sports Club',
      desc: 'Championship 9-ft English snooker tables, table tennis, foosball, carrom boards, and chess corners.',
    },
    {
      icon: Flame,
      title: 'Sunset Bonfire & Stargazing',
      desc: 'Private campfire setups with live acoustic music, roasted marshmallows, and open barbecue grills.',
    },
    {
      icon: Coffee,
      title: 'Wellness & Morning Yoga',
      desc: 'Sunrise pranayama and guided meditation sessions conducted directly on the overwater wooden yoga decks.',
    },
  ];

  return (
    <section id="amenities" className="w-full py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Resort Experiences & Leisure</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Curated Activities for All Ages</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
              Endless Recreation by Land and Lagoon
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
              From tranquil morning kayak glides to lively poolside rain dances and starlit bonfire
              evenings. Every hour brings a new memory.
            </p>
          </div>
        </div>

        {/* 6-Grid Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {AMENITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Day Outing Package Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                Popular for Corporate Teams & Families
              </span>
              <h3 className="text-2xl md:text-4xl font-serif-luxury font-bold text-white">
                All-Inclusive Day Outing Pass
              </h3>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Enjoy a full day retreat from 9:30 AM to 6:30 PM. Includes Welcome Mocktail, Grand
                Buffet Lunch at Oasis, 1 Hour Lagoon Pedal Boating, Infinity Pool & Rain Dance access,
                Indoor Games club, and Evening High Tea with snacks.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Welcome Drink & Lunch Buffet</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pedal Boating on Lagoon</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pool & Rain Dance Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Snooker & Indoor Games</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Evening High Tea & Snacks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Changing Rooms & Lockers</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Per Person Rate</span>
              <div className="text-3xl md:text-4xl font-extrabold text-white">
                ₹1,499 <span className="text-xs font-normal text-slate-400">/ adult + GST</span>
              </div>
              <p className="text-[11px] text-amber-300">
                Special Kids Rate: ₹899 / child (Ages 5–12)
              </p>
              <button
                onClick={onBookDayPass}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
              >
                Book Day Outing Pass
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
