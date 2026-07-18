import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, DoorOpen, ImagePlus, Loader2, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminRoom,
  type CreateRoomPayload,
  createRoom,
  fetchAdminRooms,
  uploadRoomImage,
} from "../admin-api";

export function AdminRoomsPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    if (!hotelId) return;
    setIsLoading(true);
    setError(null);
    try {
      setRooms(await fetchAdminRooms(hotelId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  }, [hotelId]);

  useEffect(() => { void load(); }, [load]);

  if (!hotelId) {
    return <p className="p-8 text-center text-sm text-slate-500">Missing hotel ID</p>;
  }

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <Link
          to="/staff/admin/hotels"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="size-3.5" />
          Back to hotels
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage rooms and upload photos
            </p>
          </div>
          <Button onClick={() => setShowForm((v) => !v)} variant="outline" size="sm">
            <Plus className="mr-1.5 size-4" />
            {showForm ? "Cancel" : "Add room"}
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <CreateRoomForm
          hotelId={hotelId}
          onCreated={(r) => {
            setRooms((prev) => [r, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-slate-400" />
        </div>
      ) : rooms.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          No rooms yet. Click "Add room" to create one.
        </p>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <RoomRow key={room.id} room={room} onUpdate={(updated) => {
              setRooms((prev) => prev.map((r) => r.id === updated.id ? { ...r, ...updated } : r));
            }} />
          ))}
        </div>
      )}
    </main>
  );
}

function CreateRoomForm({
  hotelId,
  onCreated,
}: {
  hotelId: string;
  onCreated: (r: AdminRoom) => void;
}) {
  const [form, setForm] = useState<CreateRoomPayload>({
    hotelId,
    roomNumber: "",
    price12h: 0,
    price24h: 0,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roomNumber.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      const room = await createRoom(form);
      onCreated(room);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Failed to create room");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-900">New room</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Room number *"
          value={form.roomNumber}
          onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Room type (e.g. Deluxe)"
          value={form.roomType ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Max occupancy"
          type="number"
          min={1}
          value={form.maxOccupancy ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, maxOccupancy: e.target.value ? Number(e.target.value) : undefined }))
          }
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="12h price (IDR) *"
          type="number"
          min={0}
          value={form.price12h || ""}
          onChange={(e) => setForm((f) => ({ ...f, price12h: Number(e.target.value) }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="24h price (IDR) *"
          type="number"
          min={0}
          value={form.price24h || ""}
          onChange={(e) => setForm((f) => ({ ...f, price24h: Number(e.target.value) }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Description"
          value={form.description ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      {err && <p className="mt-3 text-xs text-red-600">{err}</p>}

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={saving || !form.roomNumber.trim()} size="sm">
          {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
          Create room
        </Button>
      </div>
    </form>
  );
}

function RoomRow({
  room,
  onUpdate,
}: {
  room: AdminRoom;
  onUpdate: (r: Partial<AdminRoom> & { id: string }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr(null);
    try {
      const updated = await uploadRoomImage(room.id, file);
      onUpdate({ id: room.id, imageUrls: updated.imageUrls });
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const coverImage = room.imageUrls?.[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {coverImage ? (
          <img
            src={coverImage}
            alt={`Room ${room.roomNumber}`}
            className="size-20 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-lg bg-slate-100">
            <DoorOpen className="size-8 text-slate-300" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Room {room.roomNumber}</h3>
            {room.roomType && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {room.roomType}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              Max {room.maxOccupancy} guests
            </span>
            <span>12h: {room.currency} {Number(room.price12h).toLocaleString()}</span>
            <span>24h: {room.currency} {Number(room.price24h).toLocaleString()}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {room.imageUrls?.length ?? 0} photo{(room.imageUrls?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <ImagePlus className="mr-1.5 size-3.5" />
            )}
            {uploading ? "Uploading…" : "Add photo"}
          </Button>
        </div>
      </div>

      {room.imageUrls && room.imageUrls.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {room.imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Room ${room.roomNumber} ${i + 1}`}
              className="size-16 shrink-0 rounded-md object-cover"
            />
          ))}
        </div>
      )}

      {uploadErr && (
        <p className="mt-2 text-xs text-red-600">{uploadErr}</p>
      )}
    </div>
  );
}
