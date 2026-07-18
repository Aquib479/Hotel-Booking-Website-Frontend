import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import HotelDetails from "@/pages/HotelDetails";
import { Checkout } from "@/pages/Checkout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Bookings from "@/pages/Bookings";
import BookingDetail from "@/pages/BookingDetail";
import BookingCancel from "@/pages/BookingCancel";
import BookingConfirmation from "@/pages/BookingConfirmation";
import Account from "@/pages/Account";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
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
              <Route path="/properties/:id" element={<HotelDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id/confirmation" element={<BookingConfirmation />} />
              <Route path="/bookings/:id/cancel" element={<BookingCancel />} />
              <Route path="/bookings/:id" element={<BookingDetail />} />
              <Route path="/account" element={<Account />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>
          </Routes>
          </StaffAuthProvider>
        </AuthProvider>
      </CurrencyProvider>
    </BrowserRouter>
  );
}
