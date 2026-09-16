import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import HotelDetails from "@/pages/HotelDetails";
import Favourites from "@/pages/Favourites";
import { Checkout } from "@/pages/Checkout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Bookings from "@/pages/Bookings";
import BookingDetail from "@/pages/BookingDetail";
import BookingCancel from "@/pages/BookingCancel";
import BookingConfirmation from "@/pages/BookingConfirmation";
import Account from "@/pages/Account";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import HowItWorks from "@/pages/HowItWorks";
import ListProperty from "@/pages/ListProperty";
import RateApp from "@/pages/RateApp";
import Coins from "@/pages/Coins";
import Reviews from "@/pages/Reviews";
import Terms from "@/pages/Terms";
import CancellationPolicy from "@/pages/CancellationPolicy";
import Privacy from "@/pages/Privacy";
import StaffLogin from "@/pages/StaffLogin";
import StaffWalkIn from "@/pages/StaffWalkIn";
import StaffDashboard from "@/pages/StaffDashboard";
import { StaffAuthProvider } from "@/features/staff";
import { StaffLayout, StaffRouteGuard } from "@/features/staff";
import { AdminHotelsPage } from "@/features/staff/pages/AdminHotelsPage";
import { AdminRoomsPage } from "@/features/staff/pages/AdminRoomsPage";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <StaffAuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/staff/login" element={<StaffLogin />} />
              <Route element={<StaffRouteGuard />}>
                <Route element={<StaffLayout />}>
                  <Route path="/staff/walk-in" element={<StaffWalkIn />} />
                  <Route path="/staff/dashboard" element={<StaffDashboard />} />
                  <Route path="/staff/admin/hotels" element={<AdminHotelsPage />} />
                  <Route path="/staff/admin/hotels/:hotelId/rooms" element={<AdminRoomsPage />} />
                </Route>
              </Route>
              <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/properties/:id" element={<HotelDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id/confirmation" element={<BookingConfirmation />} />
              <Route path="/bookings/:id/cancel" element={<BookingCancel />} />
              <Route path="/bookings/:id" element={<BookingDetail />} />
              <Route path="/account" element={<Account />} />
              <Route path="/coins" element={<Coins />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/faq" element={<Navigate to="/contact" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/rate-app" element={<RateApp />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>
          </Routes>
          </StaffAuthProvider>
        </AuthProvider>
      </CurrencyProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
