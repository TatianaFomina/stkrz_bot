import i18n from 'i18n';
import path from 'path';
const __dirname = path.dirname('.');

/**
 * Configure shared state
 */
i18n.configure({
  locales: ['en', 'ru'],
  directory: path.join(__dirname, 'src', 'i18n', './locales'),
});

/**
 * Returns localised massage
 *
 * @param message - message to translate
 */
export function __(message: string): string {
  return i18n.__(message);
}

/**
 * Updates app locale
 *
 * @param locale - new locale value
 */
export function setLocale(locale: string): void {
  i18n.setLocale(locale);
}
