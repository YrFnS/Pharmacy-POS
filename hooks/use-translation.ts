import { useStore } from "@/lib/store";
import { translations, TranslationKey } from "@/lib/i18n";

export function useTranslation() {
  const language = useStore((state) => state.language);
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, language, isRtl: language === 'ar' };
}
