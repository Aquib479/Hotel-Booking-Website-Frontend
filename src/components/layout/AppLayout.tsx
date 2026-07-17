import { Outlet } from "react-router-dom";
import { SiteNavbar } from "./SiteNavbar";
import { SiteFooter } from "./SiteFooter";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar variant="default" />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
