import { type Ref } from 'vue';
import { useFonts, type Font } from './useFonts';
import { wrapText } from '../utils/wrap-text';
import { alignWrappedTextVertically } from '../utils/align-wrapped-text-vertically';
import { alignWrappedTextHorizontally } from '../utils/align-wrapped-text-horizontally';

interface TextParams {
  font: Font;
  fontSize: number;
  strokeSize: number;
  fontColor: string;
}

export function useCanvas(canvas: Ref<HTMLCanvasElement | null>): UseCanvas {
  const { load, exists } = useFonts();

  /**
   * Renders specified text on canvas
   * @param text - text to render
   * @param params - text params
   */
  async function displayText(text: string, params: TextParams): Promise<void> {
    if (canvas.value === null) {
      return;
    }

    const ctx = canvas.value.getContext('2d');

    if (ctx === null || ctx === undefined) {
      return;
    }

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    if (!exists(params.font)) {
      await load(params.font);
    }

    ctx.textAlign = 'center';
    ctx.font = `${params.fontSize}px ${params.font}`;
    ctx.fillStyle = params.fontColor;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = params.strokeSize;
    ctx.lineJoin = 'round';

    const lineHeight = params.fontSize + 20;
    const paragraphs = text.split(/\r?\n/);
    // @ts-expect-error canvas.value can not be null, as there is a check at the beginning of the function
    const textWrapped = paragraphs.map((p, index) => wrapText(ctx, p, canvas.value.width / 2, canvas.value.height / 2 + index * lineHeight, canvas.value.width, lineHeight)).flat();
    const textWrappedAndAlignedVertically = alignWrappedTextVertically(ctx, textWrapped, canvas.value.height);
    const textWrappedAndAligned = alignWrappedTextHorizontally(ctx, textWrappedAndAlignedVertically, params.font, params.fontSize);

    textWrappedAndAligned.forEach(([text, x, y]) => {
      if (params.strokeSize !== 0) {
        ctx.strokeText(text, x, y);
      }

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
  displayText: (text: string, params: TextParams) => Promise<void>;
  getImageData: () => Promise<Blob | null>;
}
