import { useLanguage } from "@/context/LanguageContext";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { getLegalDocument } from "../constants/legalContent";

export function CancellationPolicyPage() {
  const { language } = useLanguage();

  return (
    <main>
      <LegalPageLayout document={getLegalDocument("cancellation-policy", language)} />
    </main>
  );
}
