/**
 * Updates X coordinates of wrapped text so that it gets positioned right in the center of canvas
 * @param ctx - rendering context
 * @param lines - wrapped text
 * @param width - canvas width
 */
export function alignWrappedTextHorizontally(ctx: CanvasRenderingContext2D, lines: Array<[string, number, number]>, canvasWidth: number): Array<[string, number, number]> {
  if (lines.length === 0) {
    return lines;
  }

  const measurements = ctx.measureText(lines[0][0]);

  const roundingBoxWidth = measurements.actualBoundingBoxLeft + measurements.actualBoundingBoxRight;
  const offset = (canvasWidth - roundingBoxWidth) / 2;
  const textWidth = measurements.width;
  const expectedOffsetFromLeft = (canvasWidth - textWidth) / 2;
  const diff = Math.round(offset - expectedOffsetFromLeft);

  return lines.map(([text, x, y]) => [text, x + diff, y]);
}
