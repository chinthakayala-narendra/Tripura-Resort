import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <h4 className="text-base font-serif-luxury font-bold text-white tracking-wider">
              TRIPURA LAGOON RESORT
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Telangana's premier overwater cottage retreat. 16 Maldivian-inspired wooden villas
              encircling a serene 3-acre turquoise lagoon.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/919849012345"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-1">
              Experiences
            </span>
            <div><a href="#accommodations" className="hover:text-amber-400 transition">Lagoon Cottages & Suites</a></div>
            <div><a href="#panoramas" className="hover:text-amber-400 transition">360° Virtual Tour</a></div>
            <div><a href="#dining" className="hover:text-amber-400 transition">Oasis Waterfront Restaurant</a></div>
            <div><a href="#banquets" className="hover:text-amber-400 transition">Vedika Convention Center</a></div>
            <div><a href="#video-studio" className="hover:text-amber-400 transition">Drone Video Media Studio</a></div>
          </div>

          {/* Location & Directions */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-1">
              Location & Access
            </span>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Chilkur Balaji Temple Road, Shankarpally Valley, Ranga Reddy District, Telangana 501203</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              35 mins drive from Gachibowli Financial District / Outer Ring Road (Exit 1).
            </p>
          </div>

          {/* Direct Concierge */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-1">
              Direct Contact
            </span>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>+91 98490 12345 / +91 40 2345 6789</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>reservations@tripuraresorts.com</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Front Desk & Room Service: 24 Hours Open
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Tripura Lagoon Resort & Conventions. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Reservation</span>
            <span>·</span>
            <span>OTA Parity Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
