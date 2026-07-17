import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WalkInRoom } from "../types";
import { RoomAvailabilityCard } from "./RoomAvailabilityCard";

interface AvailableRoomsPanelProps {
  rooms: WalkInRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (room: WalkInRoom) => void;
  isLoading: boolean;
  error: string | null;
  lastRefreshedAt: Date | null;
  onRefresh: () => void;
}

function formatRefreshTime(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function AvailableRoomsPanel({
  rooms,
  selectedRoomId,
  onSelectRoom,
  isLoading,
  error,
  lastRefreshedAt,
  onRefresh,
}: AvailableRoomsPanelProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm">Available rooms today</CardTitle>
          <CardDescription>Ring-fenced Direct inventory only</CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <RefreshCw />
          )}
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 pt-0">
        <p className="text-xs text-muted-foreground">
          Updated {formatRefreshTime(lastRefreshedAt)} · auto-refresh every 30s
        </p>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {!isLoading && rooms.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No rooms available for remaining slots today.
          </p>
        )}

        <div className="flex-1 space-y-2 overflow-y-auto">
          {rooms.map((room) => (
            <RoomAvailabilityCard
              key={room.id}
              room={room}
              selected={selectedRoomId === room.id}
              onSelect={() => onSelectRoom(room)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
