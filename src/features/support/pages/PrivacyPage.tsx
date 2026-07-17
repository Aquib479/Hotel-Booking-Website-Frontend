import { LegalPageLayout } from "../components/LegalPageLayout";
import { PRIVACY_POLICY } from "../constants/legalContent";

export function PrivacyPage() {
  return (
    <main>
      <LegalPageLayout document={PRIVACY_POLICY} />
    </main>
  );
}
