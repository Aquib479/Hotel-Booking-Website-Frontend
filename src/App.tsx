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
import Account from "@/pages/Account";

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/properties/:id" element={<HotelDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id" element={<BookingDetail />} />
              <Route path="/bookings/:id/cancel" element={<BookingCancel />} />
              <Route path="/account" element={<Account />} />
            </Route>
          </Routes>
        </AuthProvider>
      </CurrencyProvider>
    </BrowserRouter>
  );
}
