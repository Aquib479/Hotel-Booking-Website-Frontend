import { useState } from "react";
import { FormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">{DELETE_ACCOUNT_COPY.title}</CardTitle>
        <CardDescription className="text-destructive/80">{DELETE_ACCOUNT_COPY.body}</CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <Button type="button" variant="destructive" onClick={() => setShowForm(true)}>
            Delete my account
          </Button>
        ) : (
          <div className="space-y-3">
            <FormField label={DELETE_ACCOUNT_COPY.confirmLabel} htmlFor="delete-confirm">
              <Input
                id="delete-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={DELETE_ACCOUNT_CONFIRM_TEXT}
                className="max-w-xs"
              />
            </FormField>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                disabled={!canDelete || isDeleting}
                onClick={() => void onDelete()}
              >
                {isDeleting ? "Deleting…" : "Permanently delete account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setConfirmText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
