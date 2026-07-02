import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import HotelDetails from "@/pages/HotelDetails";
import { Checkout } from "@/pages/Checkout";

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/properties/:id" element={<HotelDetails />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </CurrencyProvider>
    </BrowserRouter>
  );
}
