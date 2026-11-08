import React, { useState } from 'react';
import {
  INITIAL_ROOM_TYPES,
  INITIAL_PHYSICAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_TABLE_RESERVATIONS,
  INITIAL_BANQUET_INQUIRIES,
} from './data/resortData';
import {
  RoomType,
  PhysicalRoom,
  RoomBooking,
  TableReservation,
  BanquetInquiry,
} from './types';
import { Navbar } from './components/Navbar';
import { HeroDroneSection } from './components/HeroDroneSection';
import { Panorama360Viewer } from './components/Panorama360Viewer';
import { RoomBookingSystem } from './components/RoomBookingSystem';
import { OasisDiningSection } from './components/OasisDiningSection';
import { VedikaBanquetSection } from './components/VedikaBanquetSection';
import { VideoFrameGrabber } from './components/VideoFrameGrabber';
import { AmenitiesSection } from './components/AmenitiesSection';
import { Footer } from './components/Footer';
import { OtaIntegrationModal } from './components/OtaIntegrationModal';
import { AdminOperationsModal } from './components/AdminOperationsModal';

export default function App() {
  // Master State
  const [roomTypes] = useState<RoomType[]>(INITIAL_ROOM_TYPES);
  const [physicalRooms, setPhysicalRooms] = useState<PhysicalRoom[]>(INITIAL_PHYSICAL_ROOMS);
  const [bookings, setBookings] = useState<RoomBooking[]>(INITIAL_BOOKINGS);
  const [tableReservations, setTableReservations] = useState<TableReservation[]>(INITIAL_TABLE_RESERVATIONS);
  const [banquetInquiries, setBanquetInquiries] = useState<BanquetInquiry[]>(INITIAL_BANQUET_INQUIRIES);

  // Modals state
  const [isOtaModalOpen, setIsOtaModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isDiningModalOpen, setIsDiningModalOpen] = useState<boolean>(false);
  const [isBanquetModalOpen, setIsBanquetModalOpen] = useState<boolean>(false);
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<string | null>(null);

  // Add new direct booking
  const handleNewBooking = (newBooking: RoomBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Simulate inbound OTA booking from BookEngine / Agoda / MMT
  const handleSimulateOtaBooking = (otaBooking: RoomBooking) => {
    setBookings((prev) => [otaBooking, ...prev]);
  };

  // Add new table reservation
  const handleNewTableReservation = (newRes: TableReservation) => {
    setTableReservations((prev) => [newRes, ...prev]);
  };

  // Add new banquet inquiry
  const handleNewBanquetInquiry = (newInquiry: BanquetInquiry) => {
    setBanquetInquiries((prev) => [newInquiry, ...prev]);
  };

  // Toggle physical room block
  const handleToggleRoomBlock = (roomId: string) => {
    setPhysicalRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, isBlocked: !r.isBlocked } : r))
    );
  };

  // Smooth scroll helpers
  const scrollToAccommodations = (slug?: string) => {
    if (slug) setSelectedRoomSlug(slug);
    const el = document.getElementById('accommodations');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPanoramas = () => {
    const el = document.getElementById('panoramas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDining = () => {
    const el = document.getElementById('dining');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBanquets = () => {
    const el = document.getElementById('banquets');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar
        onBookClick={() => scrollToAccommodations()}
        onOpenOta={() => setIsOtaModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      <main className="flex-1">
        {/* 1. Hero Drone Aerial Section */}
        <HeroDroneSection
          onExplore360={scrollToPanoramas}
          onCheckAvailability={() => scrollToAccommodations()}
        />

        {/* 2. Interactive 360° Virtual Panorama Tour */}
        <Panorama360Viewer
          onSelectRoom={(slug) => scrollToAccommodations(slug)}
          onOpenDining={() => setIsDiningModalOpen(true)}
          onOpenBanquet={() => scrollToBanquets()}
        />

        {/* 3. Room & Cottage Accommodations with Live Availability Search */}
        <RoomBookingSystem
          roomTypes={roomTypes}
          physicalRooms={physicalRooms}
          bookings={bookings}
          onNewBooking={handleNewBooking}
          onOpenPanoramaScene={() => scrollToPanoramas()}
          selectedRoomSlug={selectedRoomSlug}
        />

        {/* 4. Oasis Restaurant & Table Booking Modal */}
        <OasisDiningSection
          reservations={tableReservations}
          onNewReservation={handleNewTableReservation}
          onOpenPanoramaScene={() => scrollToPanoramas()}
          isModalOpen={isDiningModalOpen}
          onCloseModal={() => setIsDiningModalOpen(false)}
        />

        {/* 5. Vedika Banquet & Convention Center Calculator */}
        <VedikaBanquetSection
          inquiries={banquetInquiries}
          onNewInquiry={handleNewBanquetInquiry}
          onOpenPanoramaScene={() => scrollToPanoramas()}
          isModalOpen={isBanquetModalOpen}
          onCloseModal={() => setIsBanquetModalOpen(false)}
        />

        {/* 6. Video Frame Grabber ("Can get images from video") */}
        <VideoFrameGrabber />

        {/* 7. Resort Amenities & Day Outing Packages */}
        <AmenitiesSection
          onBookDayPass={() => {
            alert('Day Outing Pass booking ticket added. Redirecting to front desk concierge.');
            scrollToAccommodations();
          }}
        />
      </main>

      {/* Global Modals */}
      <OtaIntegrationModal
        isOpen={isOtaModalOpen}
        onClose={() => setIsOtaModalOpen(false)}
        bookings={bookings}
        roomTypes={roomTypes}
        physicalRooms={physicalRooms}
        onSimulateOtaBooking={handleSimulateOtaBooking}
      />

      <AdminOperationsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        roomTypes={roomTypes}
        physicalRooms={physicalRooms}
        bookings={bookings}
        onToggleRoomBlock={handleToggleRoomBlock}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
