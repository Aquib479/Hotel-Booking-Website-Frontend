import { Outlet, useLocation } from "react-router-dom";
import { SiteNavbar } from "./SiteNavbar";
import { SiteFooter } from "./SiteFooter";

export function AppLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar variant={isHome ? "overlay" : "default"} />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHome && <SiteFooter />}
    </div>
  );
}
