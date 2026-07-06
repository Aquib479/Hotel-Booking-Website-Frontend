import { useState } from "react";
import { DELETE_ACCOUNT_CONFIRM_TEXT, DELETE_ACCOUNT_COPY } from "../constants";

interface DeleteAccountSectionProps {
  isDeleting: boolean;
  onDelete: () => Promise<boolean>;
}

export function DeleteAccountSection({ isDeleting, onDelete }: DeleteAccountSectionProps) {
  const [confirmText, setConfirmText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const canDelete = confirmText === DELETE_ACCOUNT_CONFIRM_TEXT;

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
      <h2 className="text-lg font-semibold text-red-800">{DELETE_ACCOUNT_COPY.title}</h2>
      <p className="mt-2 text-sm text-red-900/80">{DELETE_ACCOUNT_COPY.body}</p>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Delete my account
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-red-800">
            {DELETE_ACCOUNT_COPY.confirmLabel}
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={DELETE_ACCOUNT_CONFIRM_TEXT}
            className="w-full max-w-xs rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!canDelete || isDeleting}
              onClick={() => void onDelete()}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Permanently delete account"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setConfirmText("");
              }}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
