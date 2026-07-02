import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Host } from "../types";

export function HostCard({ host }: { host: Host }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={host.avatar}
          alt={host.name}
          className="size-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-foreground">{host.name}</p>
          <p className="text-sm text-muted-foreground">
            {host.trips} trips · Host since {host.hostSince}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" className="rounded-xl">
          View Profile
        </Button>
        <Button variant="outline" className="rounded-xl">
          <MessageCircle className="size-4" />
          Contact
        </Button>
      </div>
    </div>
  );
}
