import { type Sticker } from '../types/sticker';

interface Store {
  title: string | null;
  name: string | null;
  stickers: Sticker[];
}
export const store: Store = {
  title: null,
  name: null,
  stickers: [],
};
