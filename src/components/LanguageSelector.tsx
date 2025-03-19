import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="p-2 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600"
    >
      <option value="en">English</option>
      <option value="tr">Türkçe</option>
    </select>
  );
}