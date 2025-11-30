import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-surface-hover transition-colors"
    >
      {language.toUpperCase()}
    </button>
  );
};

export default LanguageSelector;
