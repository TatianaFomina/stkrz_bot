/**
 * Splits specified text into lines in order to make it fit into HTML canvas of fixed fidth
 *
 * source: https://fjolt.com/article/html-canvas-how-to-wrap-text#
 *
 * @param ctx - rendering context
 * @param text - text to wrap
 * @param x - X starting point of the text on the canvas
 * @param y - Y starting point of the text on the canvas
 * @param maxWidth - width at which we want line breaks to begin - i.e. the maximum width of the canvas.
 * @param lineHeight - height of each line, so we can space them below each other
 */
export function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): Array<[string, number, number]> {
  const words = text.split(' ');
  let line = ''; // text of the current line
  let testLine = ''; // stores the text after adding a word to test if it's too long
  const lineArray: Array<[string, number, number]> = []; // array of lines, which the function will return

  for (let n = 0; n < words.length; n++) {
    testLine += `${words[n]} `;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      /* If the width of this test line is more than the max width, then the line is finished */
      lineArray.push([line, x, y]);

      /* Increase the line height, so a new line is started */
      y += lineHeight;
      /* Update line and test line to use this word as the first word on the next line */
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else {
      /* If the test line is still less than the max width, then add the word to the current line */
      line += `${words[n]} `;
    }
    /* If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something */
    if (n === words.length - 1) {
      lineArray.push([line, x, y]);
    }
  }

  /* Return the line array */
  return lineArray;
};
