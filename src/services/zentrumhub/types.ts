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

export interface HotelRateOffer {
  title?: string | null;
  description?: string | null;
  discountOffer?: string | null;
  percentageDiscountOffer?: string | null;
}

export interface HotelRate {
  totalRate?: number;
  publishedRate?: number;
  baseRate?: number;
  taxes?: number;
  fees?: number;
  discounts?: number;
  commission?: number;
  minSellingRate?: number;
  providerId?: string | null;
  providerName?: string | null;
  providerHotelId?: string | null;
  boardBasis?: {
    description?: string | null;
    type?: string | null;
  } | null;
  refundability?: string | null;
  offer?: HotelRateOffer | null;
  offers?: HotelRateOffer[] | null;
  payAtHotel?: boolean | null;
  distributionType?: string | null;
  type?: string | null;
  cancellationPolicy?: unknown;
  additionalInformation?: Array<{ type?: string | null; text?: string | null }> | null;
}

export interface HotelOptions {
  freeBreakfast?: boolean | null;
  freeCancellation?: boolean | null;
  refundable?: boolean | null;
  payAtHotel?: boolean | null;
  roomOnly?: boolean | null;
  halfBoard?: boolean | null;
  fullBoard?: boolean | null;
  allInclusive?: boolean | null;
  contractedRateExists?: boolean | null;
  isGstMandatory?: boolean | null;
  isPANMandatory?: boolean | null;
  isPrivateDistribution?: boolean | null;
  isPublicDistribution?: boolean | null;
  isOptimizedDistribution?: boolean | null;
  isCorporateDistribution?: boolean | null;
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

export interface HotelContentGuestReview {
  ReviewerName?: string | null;
  Source?: string | null;
  Title?: string | null;
  Text?: string | null;
  Rating?: string | number | null;
  TravelCompanion?: string | null;
  /** Some providers return camelCase */
  reviewerName?: string | null;
  source?: string | null;
  title?: string | null;
  text?: string | null;
  rating?: string | number | null;
  travelCompanion?: string | null;
}

export interface HotelContentReview {
  provider?: string | null;
  count?: string | number | null;
  rating?: string | number | null;
  Rating?: string | number | null;
  url?: string | null;
  categoryratings?: Array<{
    category?: string | null;
    rating?: string | number | null;
  }> | null;
  guestreviews?: HotelContentGuestReview[] | null;
}

export interface HotelContentAttribute {
  key?: string | null;
  value?: string | null;
}

export interface HotelContentItem {
  id?: string | null;
  name?: string | null;
  providerHotelId?: string | null;
  providerId?: string | null;
  providerName?: string | null;
  language?: string | null;
  chainCode?: string | null;
  chainName?: string | null;
  type?: string | null;
  category?: string | null;
  starRating?: number | string | null;
  distance?: string | number | null;
  imageCount?: string | number | null;
  reviews?: HotelContentReview | HotelContentReview[] | null;
  contact?: {
    address?: {
      line1?: string | null;
      city?: { name?: string | null } | null;
      state?: { name?: string | null } | null;
      country?: { name?: string | null; code?: string | null } | null;
      postalCode?: string | null;
    };
    phones?: string[] | null;
    emails?: string[] | null;
    fax?: string[] | null;
  };
  geoCode?: GeoCode;
  neighbourhoods?: unknown[] | null;
  heroImage?: string | null;
  images?: HotelContentImage[] | null;
  facilities?: Array<{
    name?: string | null;
    id?: string | null;
    groupId?: string | null;
  }> | null;
  descriptions?: Array<{ type?: string | null; text?: string | null }> | null;
  attributes?: HotelContentAttribute[] | null;
  availableSuppliers?: string[] | null;
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

export interface GuestReviewDetail {
  title?: string | null;
  verificationSource?: string | null;
  summary?: string | null;
  dateSubmitted?: string | null;
  score?: string | number | null;
  reviewer?: {
    country?: string | null;
    name?: string | null;
    travelPurpose?: string | null;
    type?: string | null;
  } | null;
  text?: string[] | null;
  managementResponses?: Array<{
    text?: string | null;
    date?: string | null;
  }> | null;
}

export interface GuestReviewsRequest {
  channelId?: string | null;
  hotelId?: string | null;
  providerName?: string | null;
  culture?: string | null;
  paginationToken?: string | null;
}

export interface GuestReviewsResponse {
  pageToken?: string | null;
  reviews?: GuestReviewDetail[] | null;
}

export interface Recommendation {
  id?: string | null;
  rates?: string[] | null;
  groupId?: number | string | null;
  /** Links recommendation to rooms[] / standardizedRooms[] */
  roomId?: string | null;
  recommendationIdentifierKey?: string | null;
}

export interface BoardBasis {
  description?: string | null;
  type?: string | null;
}

/** Image link sizes from content providers (EAN / TravelAPI). */
export type RoomImageLinkSize = "Xs" | "Standard" | "Xxl" | string;

export interface RoomImageLink {
  url?: string | null;
  size?: RoomImageLinkSize | null;
}

export interface RoomImage {
  url?: string | null;
  caption?: string | null;
  links?: RoomImageLink[] | null;
}

export interface RoomFacility {
  name?: string | null;
  id?: string | null;
}

export interface RoomBed {
  type?: string | null;
  count?: number | string | null;
}

export interface RoomArea {
  squareFeet?: number | string | null;
  squareMeters?: number | string | null;
}

export interface MappedRoomRate {
  inputIndex?: string | null;
  roomCode?: string | null;
  boardBasis?: string | null;
  refundability?: string | null;
  rateId?: string | null;
}

export interface StandardizedRoom {
  id?: string | null;
  name?: string | null;
  type?: string | null;
  description?: string | null;
  images?: Array<RoomImage | string> | null;
  facilities?: Array<RoomFacility | string> | null;
  maxOccupancy?: number | string | null;
  maxGuestAllowed?: number | string | null;
  maxAdultAllowed?: number | string | null;
  maxChildrenAllowed?: number | string | null;
  area?: RoomArea | number | string | null;
  areaSquareMeters?: number | string | null;
  views?: string[] | null;
  beds?: RoomBed[] | null;
  bedInfo?: string | null;
  smokingAllowed?: boolean | null;
  mappedRoomRates?: MappedRoomRate[] | null;
  attributes?: unknown[] | null;
}

export interface RateTax {
  amount?: number;
  description?: string | null;
  isIncludedInBaseRate?: boolean | null;
}

export interface RateDailyRate {
  amount?: number;
  date?: string | null;
  taxIncluded?: boolean | null;
  discount?: number | null;
}

export interface RatePolicy {
  type?: string | null;
  text?: string | null;
}

export interface RateOffer {
  title?: string | null;
  description?: string | null;
  discountOffer?: string | number | null;
  percentageDiscountOffer?: string | number | null;
}

export interface CancellationRule {
  value?: number | null;
  valueType?: string | null;
  estimatedValue?: number | null;
  start?: string | null;
  end?: string | null;
}

export interface CancellationPolicy {
  text?: string | null;
  rules?: CancellationRule[] | null;
}

export interface RatePlan {
  id?: string | null;
  availability?: string | null;
  needsPriceCheck?: boolean;
  isPackageRate?: boolean;
  providerId?: string | null;
  providerName?: string | null;
  isContractedRate?: boolean | null;
  type?: string | null;
  isRefundable?: boolean | null;
  refundable?: boolean | null;
  refundability?: string | null;
  boardBasis?: BoardBasis | string | null;
  occupancies?: Array<{
    roomId?: string | null;
    stdRoomId?: string | null;
    numOfAdults?: number | string;
    numOfChildren?: number | string;
  }> | null;
  totalRate?: number;
  baseRate?: number;
  publishedRate?: number;
  publishedBaseRate?: number;
  minSellingRate?: number;
  currency?: string | null;
  taxes?: number | RateTax[] | null;
  fees?: number | Array<{ amount?: number; description?: string | null }> | null;
  dailyRates?: RateDailyRate[] | null;
  policies?: RatePolicy[] | null;
  offers?: RateOffer[] | null;
  includes?: string[] | null;
  cancellationPolicies?: CancellationPolicy[] | null;
  allGuestsInfoRequired?: boolean | null;
  onlineCancellable?: boolean | null;
  specialRequestSupported?: boolean | null;
  payAtHotel?: boolean | null;
  cardRequired?: boolean | null;
  depositRequired?: boolean | null;
  guaranteeRequired?: boolean | null;
  IsPassportMandatory?: boolean | null;
  IsPANMandatory?: boolean | null;
  providerHotelId?: string | null;
  additionalInformation?: Array<{ type?: string | null; text?: string | null }> | null;
  standardizedRoomId?: string | null;
}

export interface RoomRaw {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  type?: string | null;
  facilities?: Array<RoomFacility | string> | null;
  images?: Array<RoomImage | string> | null;
  beds?: RoomBed[] | null;
  smokingAllowed?: boolean | null;
  maxGuestAllowed?: number | string | null;
  maxAdultAllowed?: number | string | null;
  maxChildrenAllowed?: number | string | null;
  views?: string[] | null;
  bedGroups?: unknown;
}

export interface StandardizedRoomGroupOption {
  recommendationId?: string | null;
  totalRate?: number;
  total?: number;
  boardBasis?: string | null;
  refundable?: boolean | null;
  standardRooms?: Array<{
    standardRoomId?: string | null;
    totalRate?: number;
    rateIds?: string[] | null;
  }> | null;
}

export interface StandardizedRoomGroup {
  id?: string | null;
  standardRoomIds?: string[] | null;
  standardRoom?: StandardizedRoom;
  options?: StandardizedRoomGroupOption[] | null;
}

export interface RoomsAndRatesHotel {
  id?: string | null;
  rooms?: RoomRaw[] | null;
  rates?: RatePlan[] | null;
  recommendations?: Recommendation[] | null;
  standardizedRooms?: StandardizedRoom[] | null;
  standardizedRoomGroups?: StandardizedRoomGroup[] | null;
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
