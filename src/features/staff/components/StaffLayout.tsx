import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, UserPlus } from "lucide-react";
import { useStaffAuth } from "../hooks/useStaffAuth";
import { STAFF_DASHBOARD_PATH, STAFF_WALK_IN_PATH } from "../constants";
import { cn } from "@/lib/utils";

export function StaffLayout() {
  const { staff, logout } = useStaffAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/staff/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <Link to={STAFF_WALK_IN_PATH} className="text-lg font-bold tracking-tight">
              RestHalf Staff
            </Link>
            {staff && (
              <p className="truncate text-xs text-slate-400">
                {staff.property.propertyName} · {staff.property.city}
              </p>
            )}
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to={STAFF_WALK_IN_PATH}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10"
                )
              }
            >
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">Walk-in</span>
            </NavLink>
            <NavLink
              to={STAFF_DASHBOARD_PATH}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10"
                )
              }
            >
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Today</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {staff && (
              <span className="hidden text-sm text-slate-300 sm:inline">{staff.displayName}</span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
