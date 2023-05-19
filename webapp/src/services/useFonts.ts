import TestFontUrl from '../assets/Font.ttf';
import AlpharatFontUrl from '../assets/ALPHARAT.ttf';
import RocherFontUrl from '../assets/RocherColorGX.ttf';

/**
 * Available fonts
 */
export enum Font {
  Alpharat = 'Alpharat',
  Nabla = 'Nabla',
  Test = 'AnEmojiFamily-Regular',
  Rocher = 'Rocher',
}

/**
 * Stores urls from where fonts can be loaded
 */
const fontsSources = {
  [Font.Alpharat]: AlpharatFontUrl,
  [Font.Nabla]: 'https://fonts.gstatic.com/s/nabla/v9/j8_D6-LI0Lvpe7Makz5UhJt9C3uqg_X_75gyGS4jAxsNIjrRBRdeFXZ6x96OvAFr.woff2',
  [Font.Test]: TestFontUrl,
  [Font.Rocher]: RocherFontUrl,
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
