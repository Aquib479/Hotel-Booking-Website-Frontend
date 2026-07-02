import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import HotelDetails from "@/pages/HotelDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/properties/:id" element={<HotelDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
