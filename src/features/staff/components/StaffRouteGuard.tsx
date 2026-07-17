import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStaffAuth } from "../hooks/useStaffAuth";
import { STAFF_LOGIN_PATH } from "../constants";

export function StaffRouteGuard() {
  const { isAuthenticated } = useStaffAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={STAFF_LOGIN_PATH} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
