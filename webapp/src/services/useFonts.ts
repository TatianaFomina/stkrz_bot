import KoskoFontUrl from '../assets/fonts/KoskoBold-Bold.ttf';
import AirfoolFontUrl from '../assets/fonts/Airfool.ttf';
import ShadowFontUrl from '../assets/fonts/Shadow-Regular.ttf';
import SwampyFontUrl from '../assets/fonts/Swampy-Clean.ttf';
import DurikFontUrl from '../assets/fonts/ДУРИК.ttf';
import LepkaFont from '../assets/fonts/LEPKA.otf';
import EuropeExtendedFont from '../assets/fonts/europeextendedc_bold.otf';
import FibreFont from '../assets/fonts/fibre-font-extended.otf';

/**
 * Available fonts
 */
export enum Font {
  Kosko = 'Kosko',
  Airfool = 'Airfool',
  Shadow = 'Shadow',
  Swampy = 'Swampy',
  Durik = 'Durik',
  Lepka = 'Lepka',
  EuropeExtended = 'EuropeExtended',
  Fibre = 'Fibre',
}

/**
 * Stores urls from where fonts can be loaded
 */
const fontsSources = {
  [Font.Kosko]: KoskoFontUrl,
  [Font.Airfool]: AirfoolFontUrl,
  [Font.Shadow]: ShadowFontUrl,
  [Font.Swampy]: SwampyFontUrl,
  [Font.Durik]: DurikFontUrl,
  [Font.Lepka]: LepkaFont,
  [Font.EuropeExtended]: EuropeExtendedFont,
  [Font.Fibre]: FibreFont,
};

/**
 * Stores names of the fonts that have been loaded
 */
const loadedFonts: Font[] = [];

export function useFonts(): UseFonts {
  /**
   * Loads font with specified name and adds it to document
   * @param fontName - one of the supported font names
   */
  async function load(fontName: Font): Promise<void> {
    const fontFace = new FontFace(fontName, `url(${fontsSources[fontName]})`);
    const font = await fontFace.load();

    document.fonts.add(font);
    loadedFonts.push(fontName);
  }

  /**
   * Checks if font is downloaded
   * @param font - font name
   */
  function exists(font: Font): boolean {
    return loadedFonts.includes(font);
  }

  return {
    load,
    exists,
  };
}

interface UseFonts {
  load: (fontName: Font) => Promise<void>;
  exists: (font: Font) => boolean;
}
