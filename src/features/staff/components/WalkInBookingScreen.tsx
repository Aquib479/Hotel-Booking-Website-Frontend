import { useEffect } from "react";
import { useStaffAuth } from "../hooks/useStaffAuth";
import { useAvailableRooms } from "../hooks/useAvailableRooms";
import { useWalkInBooking } from "../hooks/useWalkInBooking";
import { AvailableRoomsPanel } from "./AvailableRoomsPanel";
import { WalkInGuestForm } from "./WalkInGuestForm";
import { WalkInSlotSelector } from "./WalkInSlotSelector";
import { WalkInPaymentPanel } from "./WalkInPaymentPanel";
import { WalkInBookingSummaryBar } from "./WalkInBookingSummaryBar";
import { StaffSuccessBanner } from "./StaffDailySummary";

export function WalkInBookingScreen() {
  const { staff } = useStaffAuth();
  const propertyId = staff?.property.propertyId;

  const { rooms, isLoading, error, lastRefreshedAt, refresh } = useAvailableRooms(propertyId);

  const {
    draft,
    selectRoom,
    selectSlot,
    updateGuest,
    setPaymentMethod,
    setCashConfirmed,
    submit,
    reset,
    canSubmit,
    isSubmitting,
    error: submitError,
    lastResult,
    commissionPreview,
    commissionCurrency,
  } = useWalkInBooking();

  useEffect(() => {
    if (lastResult?.success) {
      void refresh();
    }
  }, [lastResult, refresh]);

  const handleConfirm = async () => {
    if (!canSubmit) return;
    const confirmed = window.confirm(
      "Confirm this walk-in booking? This will commit inventory and record payment."
    );
    if (!confirmed) return;
    await submit();
  };

  const handleNewWalkIn = () => {
    reset();
    void refresh();
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6">
        {lastResult?.success && (
          <div className="mb-4">
            <StaffSuccessBanner
              confirmationCode={lastResult.confirmationCode}
              onDismiss={handleNewWalkIn}
            />
          </div>
        )}

        {submitError && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <div className="grid min-h-[520px] gap-4 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(260px,300px)] lg:gap-5">
          <AvailableRoomsPanel
            rooms={rooms}
            selectedRoomId={draft.room?.id ?? null}
            onSelectRoom={selectRoom}
            isLoading={isLoading}
            error={error}
            lastRefreshedAt={lastRefreshedAt}
            onRefresh={() => void refresh()}
          />

          <div className="space-y-4">
            <WalkInGuestForm guest={draft.guest} onChange={updateGuest} />
            <WalkInSlotSelector
              availableSlots={draft.room?.availableSlots ?? []}
              value={draft.slot}
              onChange={selectSlot}
              disabled={!draft.room}
            />
          </div>

          <WalkInPaymentPanel
            paymentMethod={draft.paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            cashConfirmed={draft.cashConfirmed ?? false}
            onCashConfirmedChange={setCashConfirmed}
            commissionAmount={commissionPreview}
            commissionCurrency={commissionCurrency ?? "IDR"}
          />
        </div>
      </div>

      <WalkInBookingSummaryBar
        roomLabel={draft.room?.label ?? null}
        slot={draft.slot}
        guestName={draft.guest.fullName}
        amount={draft.room?.rateAmount ?? null}
        currency={draft.room?.rateCurrency ?? staff?.property.localCurrency ?? "IDR"}
        commissionAmount={commissionPreview}
        canSubmit={Boolean(canSubmit && !lastResult?.success)}
        isSubmitting={isSubmitting}
        onConfirm={() => void handleConfirm()}
      />
    </div>
  );
}
