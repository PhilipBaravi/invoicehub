import { FC } from "react";
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LanguageSelector: FC = () => {
  const { t, i18n } = useTranslation();

  // Get the placeholder text based on the current language
  const currentLanguage = i18n.language || 'en'; // Default to 'en' if i18n.language is not set
  const placeholderText =
    currentLanguage === 'en' ? t('languageSelector.ENGLISH') :
    currentLanguage === 'ge' ? t('languageSelector.GEORGIAN') :
    currentLanguage === 'es' ? t('languageSelector.SPANISH') :
    t('languageSelector.ENGLISH'); // Fallback to English

  return (
    <Select onValueChange={(lang) => i18n.changeLanguage(lang)}>
      <SelectTrigger className="w-[120px] bg-white dark:bg-stone-800">
        <SelectValue placeholder={placeholderText} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('languageSelector.ENGLISH')}</SelectItem>
        <SelectItem value="ge">{t('languageSelector.GEORGIAN')}</SelectItem>
        <SelectItem value="es">{t('languageSelector.SPANISH')}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
