import { TRANSLATIONS } from '../constants/translations';
import { useLang } from '../context/AppContext';

export const useT = () => {
  const lang = useLang();
  return TRANSLATIONS[lang] || TRANSLATIONS.uz;
};
