import { i18n } from '../i18n';

export function useLocale(): UseLocale {
  /**
   * Returns localised message
   * @param path - message path
   */
  function t(path: string): string {
    return i18n.global.t(path);
  }

  /**
   * Updates app locale
   * @param locale - new locale value
   */
  function setLocale(locale: string): void {
    i18n.global.locale.value = locale;
  }

  return {
    t,
    setLocale,
  };
}

interface UseLocale {
  t: (path: string) => string;
  setLocale: (value: string) => void;
}
