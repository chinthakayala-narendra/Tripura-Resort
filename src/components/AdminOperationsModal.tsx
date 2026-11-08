import React from 'react';
import { PhysicalRoom, RoomType, RoomBooking } from '../types';
import {
  SlidersHorizontal,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Users,
  Calendar,
} from 'lucide-react';

interface AdminOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTypes: RoomType[];
  physicalRooms: PhysicalRoom[];
  bookings: RoomBooking[];
  onToggleRoomBlock: (roomId: string) => void;
}

export const AdminOperationsModal: React.FC<AdminOperationsModalProps> = ({
  isOpen,
  onClose,
  roomTypes,
  physicalRooms,
  bookings,
  onToggleRoomBlock,
}) => {
  if (!isOpen) return null;

  const totalRooms = physicalRooms.length;
  const blockedRooms = physicalRooms.filter((r) => r.isBlocked).length;
  const activeRooms = totalRooms - blockedRooms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Resort Operations & Inventory Control</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono">Live PMS Sync</span>
            </div>
            <h3 className="text-2xl font-serif-luxury font-bold text-white mt-1">
              Physical Unit Inventory & Room Blocking
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any room number below to instantly toggle its blocked status for walk-in VIPs or
              routine maintenance.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        {/* Inventory Summary Pills */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <span className="text-xs text-slate-400">Total Physical Units</span>
            <div className="text-2xl font-extrabold text-white mt-1">{totalRooms}</div>
            <span className="text-[11px] text-slate-400">16 Cottages · 8 Suites · 4 Villas</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-xs text-emerald-300">Live & Bookable Online</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{activeRooms}</div>
            <span className="text-[11px] text-emerald-300">Available across Web & OTAs</span>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
            <span className="text-xs text-red-300">Blocked / Maintenance</span>
            <div className="text-2xl font-extrabold text-red-400 mt-1">{blockedRooms}</div>
            <span className="text-[11px] text-red-300">Offline from all channels</span>
          </div>
        </div>

        {/* Unit Grids by Category */}
        <div className="space-y-6">
          {roomTypes.map((type) => {
            const units = physicalRooms.filter((r) => r.roomTypeId === type.id);
            const availableCount = units.filter((r) => !r.isBlocked).length;

            return (
              <div key={type.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{type.name}</h4>
                    <span className="text-xs text-slate-400">
                      Base Rate: ₹{type.basePrice.toLocaleString('en-IN')}/night
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-400">
                    {availableCount} of {units.length} Live
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {units.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => onToggleRoomBlock(unit.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                        unit.isBlocked
                          ? 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                          : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                      title={
                        unit.isBlocked
                          ? `Unit ${unit.roomNumber} is Blocked. Click to Unblock.`
                          : `Unit ${unit.roomNumber} is Live. Click to Block.`
                      }
                    >
                      {unit.isBlocked ? (
                        <Lock className="w-3 h-3 text-red-400" />
                      ) : (
                        <Unlock className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>{unit.roomNumber}</span>
                      <span className="text-[10px] opacity-70">
                        {unit.isBlocked ? '(Blocked)' : '(Live)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
