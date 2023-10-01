import { generate } from 'random-words';

/**
 * Contains util functions for generating random data
 */
export function useRandom(): {
  getRandomTitle: () => string;
  getRandomName: () => string;
} {
  function getRandomTitle(): string {
    const word = generate({ maxLength: 6 }) as unknown as string;

    return word.charAt(0).toUpperCase() + word.slice(1, word.length);
  }

  function getRandomName(): string {
    const words = generate(2);

    return words.join('_');
  }

  return {
    getRandomTitle,
    getRandomName,
  };
}
