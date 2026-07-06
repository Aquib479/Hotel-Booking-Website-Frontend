import { Link } from "react-router-dom";
import { AUTH_BRAND_HEADLINE, AUTH_BRAND_SUBLINE, AUTH_HERO_IMAGE } from "../constants";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-[45%] overflow-hidden lg:block">
        <img src={AUTH_HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-brand/30" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            RestHalf
          </Link>
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight xl:text-4xl">
              {AUTH_BRAND_HEADLINE}
            </h2>
            <p className="mt-3 max-w-md text-base text-white/85">{AUTH_BRAND_SUBLINE}</p>
          </div>
          <p className="text-sm text-white/60">© RestHalf</p>
        </div>
      </aside>

      <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
              RestHalf
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{AUTH_BRAND_HEADLINE}</p>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
