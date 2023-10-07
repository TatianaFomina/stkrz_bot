import { useRandom } from '../services/useRandom';
import { type Sticker } from '../types/sticker';

interface Store {
  title: string | null;
  name: string | null;
  stickers: Sticker[];
}

const { getRandomName, getRandomTitle } = useRandom();

export const store: Store = {
  title: getRandomTitle(),
  name: getRandomName(),
  stickers: [],
};
