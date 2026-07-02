import Home from '../pages/Home';
import HotelDetails from '../pages/HotelDetails';
import SearchResults from '../pages/SearchResults';
import { Checkout } from '../pages/Checkout';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/properties/:id', element: <HotelDetails /> },
  { path: '/search', element: <SearchResults /> },
  { path: '/checkout', element: <Checkout /> },
];
