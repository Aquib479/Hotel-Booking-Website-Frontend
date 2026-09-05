import { useLanguage } from "@/context/LanguageContext";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { getLegalDocument } from "../constants/legalContent";

export function TermsPage() {
  const { language } = useLanguage();

  return (
    <main>
      <LegalPageLayout document={getLegalDocument("terms", language)} />
    </main>
  );
}
