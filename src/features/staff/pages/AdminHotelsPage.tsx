import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ImagePlus, Loader2, Plus, Star, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminHotel,
  type CreateHotelPayload,
  createHotel,
  fetchAdminHotels,
  uploadHotelImage,
} from "../admin-api";

export function AdminHotelsPage() {
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setHotels(await fetchAdminHotels());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hotels");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hotels</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage hotels and their photos
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} variant="outline" size="sm">
          <Plus className="mr-1.5 size-4" />
          {showForm ? "Cancel" : "Add hotel"}
        </Button>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <CreateHotelForm
          onCreated={(h) => {
            setHotels((prev) => [h, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-slate-400" />
        </div>
      ) : hotels.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          No hotels yet. Click "Add hotel" to create one.
        </p>
      ) : (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <HotelRow key={hotel.id} hotel={hotel} onUpdate={(updated) => {
              setHotels((prev) => prev.map((h) => h.id === updated.id ? { ...h, ...updated } : h));
            }} />
          ))}
        </div>
      )}
    </main>
  );
}

function CreateHotelForm({ onCreated }: { onCreated: (h: AdminHotel) => void }) {
  const [form, setForm] = useState<CreateHotelPayload>({ name: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      const hotel = await createHotel(form);
      onCreated(hotel);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Failed to create hotel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-900">New hotel</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Hotel name *"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="City"
          value={form.city ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Country"
          value={form.country ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Address"
          value={form.address ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Rating (0-5)"
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={form.rating ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, rating: e.target.value ? Number(e.target.value) : undefined }))
          }
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Latitude (e.g. -8.409518)"
          type="number"
          step="any"
          min={-90}
          max={90}
          value={form.latitude ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, latitude: e.target.value ? Number(e.target.value) : undefined }))
          }
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Longitude (e.g. 115.188916)"
          type="number"
          step="any"
          min={-180}
          max={180}
          value={form.longitude ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, longitude: e.target.value ? Number(e.target.value) : undefined }))
          }
        />
      </div>

      {err && (
        <p className="mt-3 text-xs text-red-600">{err}</p>
      )}

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={saving || !form.name.trim()} size="sm">
          {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
          Create hotel
        </Button>
      </div>
    </form>
  );
}

function HotelRow({
  hotel,
  onUpdate,
}: {
  hotel: AdminHotel;
  onUpdate: (h: Partial<AdminHotel> & { id: string }) => void;
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
      const isCover = !hotel.imageUrl;
      const updated = await uploadHotelImage(hotel.id, file, isCover);
      onUpdate({ id: hotel.id, imageUrl: updated.imageUrl, imageUrls: updated.imageUrls });
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {hotel.imageUrl ? (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="size-20 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-lg bg-slate-100">
            <Building2 className="size-8 text-slate-300" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">{hotel.name}</h3>
            {hotel.rating != null && (
              <span className="flex items-center gap-0.5 text-xs text-amber-600">
                <Star className="size-3 fill-current" />
                {hotel.rating}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {[hotel.city, hotel.country].filter(Boolean).join(", ") || "No location set"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {hotel.roomCount} room{hotel.roomCount !== 1 ? "s" : ""} ·{" "}
            {hotel.imageUrls?.length ?? 0} photo{(hotel.imageUrls?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={`/staff/admin/hotels/${hotel.id}/rooms`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <DoorOpen className="size-3.5" />
            Rooms
          </Link>

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

      {hotel.imageUrls && hotel.imageUrls.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {hotel.imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${hotel.name} ${i + 1}`}
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
