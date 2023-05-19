/**
 * Updates Y coordinates of wrapped text so that it gets positioned in the center of canvas
 * @param ctx - rendering context
 * @param lines - wrapped text
 * @param height - canvas height
 */
export function alignWrappedTextVertically(ctx: CanvasRenderingContext2D, lines: Array<[string, number, number]>, height: number): Array<[string, number, number]> {
  if (lines.length === 0 || lines.length === 1) {
    return lines;
  }

  const top = lines[0][2] - ctx.measureText(lines[0][0]).actualBoundingBoxAscent;
  const bottom = lines[lines.length - 1][2] + ctx.measureText(lines[lines.length - 1][0]).actualBoundingBoxDescent;
  const expectedOffsetFromTop = (height - (bottom - top)) / 2;
  const diff = top - expectedOffsetFromTop;

  return lines.map(([text, x, y]) => [text, x, y - diff]);
}
