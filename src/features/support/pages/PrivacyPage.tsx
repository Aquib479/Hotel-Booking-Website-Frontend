import { useLanguage } from "@/context/LanguageContext";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { getLegalDocument } from "../constants/legalContent";

export function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <main>
      <LegalPageLayout document={getLegalDocument("privacy", language)} />
    </main>
  );
}
