import { Outlet, useLocation } from "react-router-dom";
import { SiteNavbar } from "./SiteNavbar";
import { SiteFooter } from "./SiteFooter";

export function AppLayout() {
  const { pathname } = useLocation();
  const isSearchPage = pathname.startsWith("/search");

  return (
    <div className="flex min-h-dvh flex-col">
      {isSearchPage ? null : <SiteNavbar />}
      <main
        className={
          isSearchPage ? "min-h-0 flex-1 overflow-hidden" : "flex-1"
        }
      >
        <Outlet />
      </main>
      {isSearchPage ? null : <SiteFooter />}
    </div>
  );
}
