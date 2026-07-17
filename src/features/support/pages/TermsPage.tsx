import { LegalPageLayout } from "../components/LegalPageLayout";
import { TERMS_OF_SERVICE } from "../constants/legalContent";

export function TermsPage() {
  return (
    <main>
      <LegalPageLayout document={TERMS_OF_SERVICE} />
    </main>
  );
}
