import { LegalPageLayout } from "../components/LegalPageLayout";
import { CANCELLATION_POLICY } from "../constants/legalContent";

export function CancellationPolicyPage() {
  return (
    <main>
      <LegalPageLayout document={CANCELLATION_POLICY} />
    </main>
  );
}
