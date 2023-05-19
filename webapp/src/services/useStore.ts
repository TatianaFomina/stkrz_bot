import { store } from '../store';
import { type Sticker } from '../types/sticker';

const lastEmoji = '\u{1F600}';

export function useStore(): UseStore {
  function addStickerData(data: Blob): void {
    store.stickers.push({
      data,
      emojis: lastEmoji,
    });
  }

  function getStickers(): Sticker[] {
    return store.stickers;
  }

  function setStickers(value: Sticker[]): void {
    store.stickers = value;
  }

  function setTitle(value: string): void {
    store.title = value;
  }

  function getTitle(): string | null {
    return store.title;
  }

  function setName(value: string): void {
    store.name = value;
  }

  function getName(): string | null {
    return store.name;
  }

  return {
    addStickerData,
    setStickers,
    getStickers,
    setTitle,
    getTitle,
    setName,
    getName,
  };
}

interface UseStore {
  addStickerData: (data: Blob) => void;
  setStickers: (value: Sticker[]) => void;
  getStickers: () => Sticker[];
  setTitle: (value: string) => void;
  getTitle: () => string | null;
  setName: (value: string) => void;
  getName: () => string | null;
}
