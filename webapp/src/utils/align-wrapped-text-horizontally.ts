import { type Font } from '../services/useFonts';

/**
 * Updates X coordinates of wrapped text so that it gets positioned right in the center of canvas
 * @param ctx - rendering context
 * @param lines - wrapped text
 * @param fontSize - font size
 * @param strokeSize - width of the text stroke
 */
export function alignWrappedTextHorizontally(ctx: CanvasRenderingContext2D, lines: Array<[string, number, number]>, font: Font, fontSize: number): Array<[string, number, number]> {
  if (lines.length === 0) {
    return lines;
  }

  const measurements = ctx.measureText(lines[0][0]);
  const expectedTextWidth = measurements.width;
  const actualTextWidth = measureText(lines[0][0], font, fontSize);
  const diff = Math.round((expectedTextWidth - actualTextWidth) / 2);

  return lines.map(([text, x, y]) => [text, x + diff, y]);
}

/**
 * Renders text in invisible element and measures its real width
 * @param text - text to render
 * @param size - fontSize
 */
function measureText(text: string, font: Font, size: number): number {
  const div = document.createElement('div');
  const textNode = document.createTextNode(text);

  document.body.appendChild(div);

  div.style.fontSize = size + 'px';
  div.style.fontFamily = font;
  div.style.position = 'absolute';
  div.style.minWidth = '-webkit-max-content';

  div.appendChild(textNode);

  const width = div.offsetWidth;

  div.remove();

  return width;
}
