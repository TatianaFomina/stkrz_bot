import { type Ref } from 'vue';
import { useFonts, type Font } from './useFonts';
import { wrapText } from '../utils/wrap-text';
import { alignWrappedTextVertically } from '../utils/align-wrapped-text-vertically';

export function useCanvas(canvas: Ref<HTMLCanvasElement | null>): UseCanvas {
  const { load, exists } = useFonts();

  async function displayText(text: string, font: Font, fontSize: number): Promise<void> {
    if (canvas.value === null) {
      return;
    }

    const ctx = canvas.value.getContext('2d');

    if (ctx === null || ctx === undefined) {
      return;
    }

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    if (!exists(font)) {
      await load(font);
    }

    ctx.textAlign = 'center';
    ctx.font = `${fontSize}px ${font}`;

    const lineHeight = fontSize + 20;
    const textWrapped = wrapText(ctx, text, canvas.value.width / 2, canvas.value.height / 2, canvas.value.width, lineHeight);
    const textWrappedAndAligned = alignWrappedTextVertically(ctx, textWrapped, canvas.value.height);

    textWrappedAndAligned.forEach(([text, x, y]) => {
      ctx.fillText(text, x, y);
    });
  }

  async function getImageData(): Promise<Blob | null> {
    const blob = await (new Promise<Blob | null>(resolve => {
      canvas.value?.toBlob(blob => { resolve(blob); });
    }));

    return blob;
  }

  return {
    displayText,
    getImageData,
  };
}

interface UseCanvas {
  displayText: (text: string, font: Font, textSize: number) => Promise<void>;
  getImageData: () => Promise<Blob | null>;
}
