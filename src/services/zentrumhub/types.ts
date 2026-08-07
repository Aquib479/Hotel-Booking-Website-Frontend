/** Shared ZentrumHub Booking Engine types (subset used by the UI). */

export type LocationType =
  | "Airport"
  | "Country"
  | "State"
  | "MultiCity"
  | "City"
  | "Region"
  | "PointOfInterest"
  | "Neighborhood"
  | "Hotel"
  | "TrainStation"
  | "BusStation"
  | "Area"
  | "Undefined";

export interface GeoCode {
  lat: number;
  long: number;
}

export interface Occupancy {
  numOfAdults: number;
  childAges?: number[];
}

export interface CircularRegion {
  centerLat: number;
  centerLong: number;
  radiusInKM: number;
}

export interface PolygonalRegion {
  coordinates: GeoCode[];
}

export interface MultiPolygonalRegion {
  polygons?: PolygonalRegion[];
}

export interface LocationSuggestionZh {
  id?: string | null;
  name?: string | null;
  fullName?: string | null;
  type?: LocationType;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  coordinates?: GeoCode;
  referenceId?: string | null;
  referenceScore?: number;
}

export interface AutosuggestResponse {
  status?: "success" | "failure";
  locationSuggestions?: LocationSuggestionZh[] | null;
}

export interface LocationDetails {
  id?: string | null;
  name?: string | null;
  fullName?: string | null;
  type?: LocationType;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  coordinates?: GeoCode;
  referenceId?: string | null;
  shape?: string | null;
  boundaries?: GeoCode[][] | null;
}

export interface AvailabilityInitRequest {
  channelId: string;
  currency: string;
  culture?: string;
  checkIn: string;
  checkOut: string;
  occupancies: Occupancy[];
  circularRegion?: CircularRegion;
  polygonalRegion?: PolygonalRegion;
  multiPolygonalRegion?: MultiPolygonalRegion;
  hotelIds?: string[] | null;
  nationality?: string | null;
  countryOfResidence?: string | null;
  destinationCountryCode?: string | null;
}

export interface AvailabilityInitResponse {
  token?: string | null;
}

export type SearchStatus = "InProgress" | "Completed";

export interface HotelRate {
  totalRate?: number;
  publishedRate?: number;
  baseRate?: number;
  taxes?: number;
  fees?: number;
  providerId?: string | null;
  providerName?: string | null;
}

export interface HotelOptions {
  freeBreakfast?: boolean | null;
  freeCancellation?: boolean | null;
  refundable?: boolean | null;
  payAtHotel?: boolean | null;
  roomOnly?: boolean | null;
}

export interface HotelAvailability {
  id?: string | null;
  relevanceScore?: number;
  rate?: HotelRate;
  /** Prefer this over legacy isNewHotel naming in some docs */
  isNewInResult?: boolean;
  moreRatesExpected?: boolean;
  isRecommended?: boolean | null;
  options?: HotelOptions;
}

export interface AvailabilityAsyncResponse {
  token?: string | null;
  nextResultsKey?: string | null;
  status?: SearchStatus;
  expectedHotelCount?: number;
  completedHotelCount?: number;
  currency?: string | null;
  hotels?: HotelAvailability[] | null;
}

export interface HotelContentImage {
  url?: string | null;
  links?: Array<{ url?: string | null; size?: string | null }> | null;
}

export interface HotelContentItem {
  id?: string | null;
  name?: string | null;
  providerHotelId?: string | null;
  starRating?: number | null;
  reviews?:
    | { rating?: number | null; count?: number | null }
    | Array<{ Rating?: string | null }>
    | null;
  contact?: {
    address?: {
      line1?: string | null;
      city?: { name?: string | null } | null;
      country?: { name?: string | null; code?: string | null } | null;
    };
    phones?: string[] | null;
    emails?: string[] | null;
  };
  geoCode?: GeoCode;
  heroImage?: string | null;
  images?: HotelContentImage[] | null;
  facilities?: Array<{ name?: string | null; id?: string | null }> | null;
  descriptions?: Array<{ type?: string | null; text?: string | null }> | null;
}

/** HotelContent.Contracts.ContentField */
export type ContentField =
  | "Basic"
  | "All"
  | "Facilities"
  | "MasterFacilities"
  | "NearByAttractions"
  | "Policies"
  | "Images"
  | "CheckInCheckout"
  | "Descriptions"
  | "Neighbourhoods"
  | "Fees"
  | "Reviews"
  | "Rooms"
  | "Curated"
  | "BasicCurated";

export interface GetHotelContentRequest {
  channelId?: string | null;
  culture?: string | null;
  hotelIds?: string[] | null;
  contentFields?: ContentField[] | null;
}

export interface GetHotelContentResponse {
  hotels?: HotelContentItem[] | null;
}

export interface Recommendation {
  id?: string | null;
  rates?: string[] | null;
  groupId?: number | string | null;
  /** Links recommendation to rooms[] / standardizedRooms[] */
  roomId?: string | null;
}

export interface BoardBasis {
  description?: string | null;
  type?: string | null;
}

export interface StandardizedRoom {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  images?: Array<{ url?: string | null } | string> | null;
  facilities?: Array<{ name?: string | null } | string> | null;
  maxOccupancy?: number | null;
  maxGuestAllowed?: number | null;
  beds?: Array<{ type?: string | null; count?: number | string | null }> | null;
}

export interface RatePlan {
  id?: string | null;
  availability?: string | null;
  needsPriceCheck?: boolean;
  isPackageRate?: boolean;
  providerId?: string | null;
  providerName?: string | null;
  isRefundable?: boolean | null;
  refundable?: boolean | null;
  refundability?: string | null;
  boardBasis?: BoardBasis | string | null;
  occupancies?: Array<{
    roomId?: string | null;
    stdRoomId?: string | null;
    numOfAdults?: number | string;
  }> | null;
  totalRate?: number;
  baseRate?: number;
  publishedRate?: number;
  currency?: string | null;
  taxes?: number | Array<{ amount?: number }> | null;
  fees?: number | Array<{ amount?: number }> | null;
  cancellationPolicies?: Array<{ text?: string | null }> | null;
  standardizedRoomId?: string | null;
}

export interface RoomRaw {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  type?: string | null;
  facilities?: Array<{ name?: string | null } | string> | null;
  images?: Array<{ url?: string | null } | string> | null;
  beds?: Array<{ type?: string | null; count?: number | string | null }> | null;
  maxGuestAllowed?: number | null;
  bedGroups?: unknown;
}

export interface RoomsAndRatesHotel {
  id?: string | null;
  rooms?: RoomRaw[] | null;
  rates?: RatePlan[] | null;
  recommendations?: Recommendation[] | null;
  standardizedRooms?: StandardizedRoom[] | null;
  standardizedRoomGroups?: Array<{
    id?: string | null;
    standardRoom?: StandardizedRoom;
    options?: Array<{
      recommendationId?: string | null;
      total?: number;
      boardBasis?: string | null;
      refundable?: boolean | null;
    }> | null;
  }> | null;
}

export interface RoomsAndRatesResponse {
  token?: string | null;
  currency?: string | null;
  hotel?: RoomsAndRatesHotel;
}

export interface PriceResponse {
  token?: string | null;
  currency?: string | null;
  hotel?: {
    id?: string | null;
    rates?: RatePlan[] | null;
    rooms?: RoomRaw[] | null;
    recommendations?: Recommendation[] | null;
  };
  totalRate?: number;
  baseRate?: number;
  publishedRate?: number;
  taxes?: number;
  fees?: number;
}

export interface PersonName {
  title?: string | null;
  first?: string | null;
  last?: string | null;
  middle?: string | null;
}

export interface PersonContact {
  phone?: string | null;
  email?: string | null;
}

export interface Person {
  type?: string | null;
  title?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  suffix?: string | null;
  age?: number | null;
  email?: string | null;
  contactNumber?: string | null;
  panCardNumber?: string | null;
}

export interface RoomsAllocation {
  roomId?: string | null;
  rateId?: string | null;
  guests?: Person[] | null;
}

export interface BookRequest {
  rateIds?: string[] | null;
  bookingRefId?: string | null;
  specialRequests?: string[] | null;
  roomsAllocations?: RoomsAllocation[] | null;
  billingContact?: Person;
  totalRate?: number;
  loggedInUserEmail?: string | null;
  guestNames?: string | null;
  bookingTag?: {
    onHold?: boolean | null;
    campaignId?: string | null;
  };
  paymentStatus?: string | null;
  travelPurpose?: "Leisure" | "Business";
}

export interface BookResponse {
  bookingId?: string | null;
  bookingStatus?: string | null;
  providerConfirmationNumber?: string | null;
  hotelConfirmationNumber?: string | null;
  token?: string | null;
  roomConfirmations?: unknown;
  cancellationToken?: string | null;
}

export interface BookingDetailsRequest {
  bookingId?: string | null;
  channelId?: string | null;
}

export interface BookingDetailsResponse {
  bookingId?: string | null;
  bookingStatus?: string | null;
  hotelConfirmationNumber?: string | null;
  providerConfirmationNumber?: string | null;
  hotel?: {
    id?: string | null;
    name?: string | null;
  };
  checkin?: string | null;
  checkout?: string | null;
  rooms?: unknown;
  rates?: unknown;
  guests?: unknown;
  cancellationToken?: string | null;
}

export interface CancelRequest {
  bookingId?: string;
  channelId?: string;
}

export interface CancelResponse {
  bookingId?: string | null;
  bookingStatus?: string | null;
  cancellationNumber?: string | null;
}
