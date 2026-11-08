import React, { useState } from 'react';
import { RoomBooking, RoomType, PhysicalRoom } from '../types';
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
  Layers,
  ArrowRight,
  Database,
} from 'lucide-react';

interface OtaIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: RoomBooking[];
  roomTypes: RoomType[];
  physicalRooms: PhysicalRoom[];
  onSimulateOtaBooking: (newBooking: RoomBooking) => void;
}

export const OtaIntegrationModal: React.FC<OtaIntegrationModalProps> = ({
  isOpen,
  onClose,
  bookings,
  roomTypes,
  physicalRooms,
  onSimulateOtaBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'bookengine' | 'webhook'>('console');
  const [selectedChannel, setSelectedChannel] = useState<'BOOKENGINE' | 'BOOKING_COM' | 'AGODA' | 'MAKEMYTRIP'>('BOOKENGINE');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const otaBookings = bookings.filter((b) => b.source !== 'WEBSITE_DIRECT');

  const handleSimulateWebhook = () => {
    setIsSyncing(true);

    setTimeout(() => {
      const room = roomTypes[0]; // Waterfront Lagoon Cottage
      const sourceMap = {
        BOOKENGINE: 'BOOKENGINE_OTA',
        BOOKING_COM: 'BOOKING_COM',
        AGODA: 'AGODA',
        MAKEMYTRIP: 'MAKEMYTRIP',
      } as const;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const mockOtaBooking: RoomBooking = {
        id: `ota-${Date.now()}`,
        bookingRef: `OTA-${selectedChannel.slice(0, 3)}-${randomNum}`,
        guestName: 'Priya & Rahul Verma',
        guestEmail: 'priya.verma@gmail.com',
        guestPhone: '+91 98200 44321',
        roomTypeId: room.id,
        roomTypeName: room.name,
        roomNumber: 'C-109',
        checkInDate: '2026-11-24',
        checkOutDate: '2026-11-26',
        nights: 2,
        guestsCount: 2,
        totalAmount: 15678,
        status: 'CONFIRMED',
        source: sourceMap[selectedChannel],
        externalOtaId: `${selectedChannel}-SYNC-${Date.now().toString().slice(-6)}`,
        addOns: ['OTA Complimentary Breakfast'],
        createdAt: new Date().toISOString(),
      };

      onSimulateOtaBooking(mockOtaBooking);
      setIsSyncing(false);
      setSimulatedNotice(
        `Successfully synced booking ${mockOtaBooking.bookingRef} from ${selectedChannel} into resort inventory!`
      );
      setTimeout(() => setSimulatedNotice(null), 4000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Channel Manager & OTA Integration Hub</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono">Two-Way XML/iCal Active</span>
            </div>
            <h3 className="text-2xl font-serif-luxury font-bold text-white mt-1">
              BookEngine & Multi-OTA Inventory Synchronizer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by BookEngine channel management API to eliminate double-bookings across all
              global distribution systems.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'console'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Live Inventory Sync Console
          </button>
          <button
            onClick={() => setActiveTab('bookengine')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'bookengine'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            BookEngine Widget Preview
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'webhook'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            API & Webhook Documentation
          </button>
        </div>

        {/* Tab 1: Live Sync Console */}
        {activeTab === 'console' && (
          <div className="mt-6 space-y-6">
            {/* Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="text-[11px] text-slate-400">Channel Partner</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-white text-sm">
                  <span>BookEngine PMS</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Sync latency: 240ms</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="text-[11px] text-slate-400">Booking.com</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-white text-sm">
                  <span>Active Live</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Rate Parity: 100%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="text-[11px] text-slate-400">MakeMyTrip / Goibibo</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-white text-sm">
                  <span>Active Live</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Inventory: 28 Units</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="text-[11px] text-slate-400">Agoda Global</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-white text-sm">
                  <span>Active Live</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Currency: INR / USD</span>
              </div>
            </div>

            {/* Test Simulated Inbound Webhook */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  Simulate Inbound OTA Reservation Webhook
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Trigger an automated mock reservation from an OTA channel to verify instant inventory
                  deduction across the database.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value as any)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  <option value="BOOKENGINE">BookEngine.com</option>
                  <option value="BOOKING_COM">Booking.com</option>
                  <option value="AGODA">Agoda</option>
                  <option value="MAKEMYTRIP">MakeMyTrip</option>
                </select>

                <button
                  onClick={handleSimulateWebhook}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Dispatching...' : 'Trigger Webhook'}</span>
                </button>
              </div>
            </div>

            {simulatedNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                ✓ {simulatedNotice}
              </div>
            )}

            {/* OTA Bookings Table */}
            <div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
                Current Active OTA Reservations ({otaBookings.length}):
              </span>
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-4">REF #</th>
                      <th>CHANNEL</th>
                      <th>GUEST</th>
                      <th>ROOM</th>
                      <th>DATES</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {otaBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {b.bookingRef}
                        </td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                            {b.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="font-medium text-white">{b.guestName}</td>
                        <td>{b.roomTypeName} ({b.roomNumber || 'Auto'})</td>
                        <td>{b.checkInDate} → {b.checkOutDate}</td>
                        <td className="font-mono tabular-nums">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            CONFIRMED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: BookEngine Widget Embed Preview */}
        {activeTab === 'bookengine' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">
                Official BookEngine Widget Integration (https://bookengine.com/):
              </span>
              Guests can book seamlessly through Tripura Resort's branded BookEngine portal or embed
              the iframe widget directly onto any sub-domain.
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400">
                    https://bookengine.com/tripura-resorts/booking-widget
                  </span>
                </div>
                <a
                  href="https://bookengine.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
                >
                  <span>Open BookEngine</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto">
                  <Globe className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-lg font-bold text-white">BookEngine Live Embed Container</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Direct PCI-compliant booking widget with multi-currency engine, coupon code
                  promotions, and automated channel inventory distribution.
                </p>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                  >
                    Use Resort Integrated Booking Engine
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API & Webhook Docs */}
        {activeTab === 'webhook' && (
          <div className="mt-6 space-y-4 text-xs">
            <p className="text-slate-300">
              The resort backend provides standardized REST & Webhook endpoints for two-way
              synchronization with BookEngine and other channel managers:
            </p>

            <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-2">
              <span className="font-mono text-amber-400">
                POST /api/webhooks/ota-sync
              </span>
              <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                {`// Headers:
// x-channel-manager-key: your_secure_ota_sync_key
// Content-Type: application/json

{
  "otaName": "BOOKENGINE",
  "externalBookingId": "BE-OTA-89320",
  "roomTypeSlug": "waterfront-cottage",
  "guestName": "Vikram Malhotra",
  "guestEmail": "vikram.m@domain.com",
  "guestPhone": "+91 98490 99887",
  "checkInDate": "2026-11-20",
  "checkOutDate": "2026-11-22",
  "totalAmount": 15678,
  "currency": "INR"
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
