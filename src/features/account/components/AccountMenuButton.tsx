import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { AccountMenuNav } from "@/features/account/components/AccountMenuNav";

interface AccountMenuButtonProps {
  isOverlay?: boolean;
}

export function AccountMenuButton({ isOverlay = false }: AccountMenuButtonProps) {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        aria-label={t("auth.menuLogin")}
        className={cn(
          "flex size-8 items-center justify-center rounded-full border transition-colors",
          isOverlay
            ? "border-white/35 bg-white/10 text-white hover:bg-white/20"
            : "border-border bg-muted text-muted-foreground hover:text-foreground"
        )}
        title={t("auth.menuLogin")}
      >
        <User className="size-5" />
      </Link>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={t("auth.accountMenu")}
        title={user?.fullName ?? t("account.account")}
        className={cn(
          "flex size-8 items-center justify-center rounded-full border transition-colors",
          isOverlay
            ? "border-white/35 bg-white/10 text-white hover:bg-white/20"
            : "border-border bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        <User className="size-5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2" sideOffset={8}>
        <div className="border-b border-border px-2 pb-2 mb-1">
          <p className="truncate text-sm font-semibold text-foreground">{user?.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <AccountMenuNav
            variant="popover"
            onNavigate={() => {
              setOpen(false);
            }}
          />
        </div>
        <button
          type="button"
          className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-brand hover:bg-brand/5"
          onClick={() => {
            setOpen(false);
            navigate("/account");
          }}
        >
          {t("account.openSettings")}
        </button>
      </PopoverContent>
    </Popover>
  );
}
