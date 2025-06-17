
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();

  console.log('Current language:', i18n.language);
  console.log('Available languages:', Object.keys(i18n.options.resources || {}));
  console.log('Translation test:', t('auth.login'));

  const toggleLanguage = () => {
    const newLang = i18n.language === 'bn' ? 'en' : 'bn';
    console.log('Switching from', i18n.language, 'to', newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex justify-end items-center mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center gap-2"
      >
        <Languages className="h-4 w-4" />
        {i18n.language === 'bn' ? 'English' : 'বাংলা'}
      </Button>
    </div>
  );
};

export default LanguageToggle;
