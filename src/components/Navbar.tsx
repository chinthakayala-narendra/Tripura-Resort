import React from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
  onOpenOta: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookClick,
  onOpenOta,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone One-Row Contract */}
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-lg md:text-xl font-serif-luxury font-bold tracking-wider text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition"
          >
            TRIPURA LAGOON RESORT
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a
              href="#accommodations"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Accommodations
            </a>
            <a
              href="#panoramas"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              360° Virtual Tour
            </a>
            <a
              href="#dining"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Oasis Dining
            </a>
            <a
              href="#banquets"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Vedika Banquets
            </a>
            <a
              href="#video-studio"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              Video Studio
            </a>
            <button
              onClick={onOpenOta}
              className="text-amber-400/90 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              OTA Sync
            </button>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              Staff PMS
            </button>
          </nav>

          {/* Zone 3: Exactly 1 Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onBookClick}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              Book Stay
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onBookClick}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3 text-sm">
          <a
            href="#accommodations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-amber-400"
          >
            Accommodations
          </a>
          <a
            href="#panoramas"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-amber-400"
          >
            360° Virtual Tour
          </a>
          <a
            href="#dining"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-amber-400"
          >
            Oasis Dining
          </a>
          <a
            href="#banquets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-amber-400"
          >
            Vedika Banquets
          </a>
          <a
            href="#video-studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-amber-400"
          >
            Video Frame Studio
          </a>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOta();
              }}
              className="text-amber-400 text-xs font-semibold"
            >
              OTA Sync Hub
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-slate-400 text-xs font-semibold"
            >
              Staff PMS
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
