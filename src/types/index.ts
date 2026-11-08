export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN' | 'CHECKED_OUT';

export type BookingSource = 
  | 'WEBSITE_DIRECT'
  | 'BOOKENGINE_OTA'
  | 'BOOKING_COM'
  | 'AGODA'
  | 'MAKEMYTRIP'
  | 'WALK_IN';

export interface RoomType {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  basePrice: number;
  capacity: number;
  sizeSqFt: number;
  bedType: string;
  viewType: string;
  amenities: string[];
  images: string[];
  panoramaSceneId: string;
}

export interface PhysicalRoom {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  isBlocked: boolean;
  blockReason?: string;
}

export interface RoomBooking {
  id: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomTypeId: string;
  roomTypeName: string;
  roomId?: string;
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestsCount: number;
  totalAmount: number;
  status: BookingStatus;
  source: BookingSource;
  externalOtaId?: string;
  addOns: string[];
  createdAt: string;
}

export type MealSlot = 'BREAKFAST' | 'LUNCH' | 'HIGH_TEA' | 'DINNER';
export type DiningZone = 'LAGOON_DECK' | 'AC_DINING' | 'POOLSIDE_CABANA';

export interface TableReservation {
  id: string;
  reservationRef: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: string;
  slot: MealSlot;
  time: string;
  guestCount: number;
  zone: DiningZone;
  specialNotes?: string;
  status: 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export type EventType = 'WEDDING' | 'RECEPTION' | 'HALDI_SANGEET' | 'CORPORATE_OFFSITE' | 'BIRTHDAY_GALA';
export type BanquetVenue = 'INDOOR_AC' | 'OPEN_LAWN' | 'COMBINED';
export type CateringTier = 'VEG_STANDARD' | 'NON_VEG_DELUXE' | 'PREMIUM_SEAFOOD_GRILL';

export interface BanquetInquiry {
  id: string;
  inquiryRef: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  eventType: EventType;
  eventDate: string;
  expectedGuests: number;
  venueChoice: BanquetVenue;
  cateringTier: CateringTier;
  estimatedTotal: number;
  notes?: string;
  status: 'PENDING_REVIEW' | 'DATE_HOLD' | 'CONFIRMED';
  createdAt: string;
}

export interface HotspotPin {
  id: string;
  title: string;
  pitch: number;
  yaw: number;
  actionType: 'room' | 'dining' | 'banquet' | 'info' | 'scene';
  targetSlug?: string;
  targetSceneId?: string;
  description: string;
  priceNote?: string;
}

export interface PanoramaScene {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  imageUrl: string;
  defaultYaw: number;
  defaultPitch: number;
  hotspots: HotspotPin[];
}

export interface VideoCapturedFrame {
  id: string;
  timestampSeconds: number;
  timeFormatted: string;
  dataUrl: string;
  label: string;
  resolution: string;
  capturedAt: string;
}
