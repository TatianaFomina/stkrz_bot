import { nanoid } from 'nanoid';
import { type Sticker } from '../types/sticker';

export interface StickersetParams {
  /** Author of the stickerset */
  userId: number;

  queryId: string;

  /** Stickerset name */
  name: string;

  /** Stickerset title */
  title: string;

  /** Stickers data */
  stickers: Sticker[];
}

export interface SingleStickerParams {
  /** Author of the sticker */
  userId: number;

  /** Sticker image data */
  data: Blob;
}

/**
 * Contains functions for communication with the server
 */
export function useServer(): UseServer {
  /**
   * Sends image to server
   * @param queryId -
   * @param blob - image data
   */
  async function sendImageData(queryId: string, userId: number, blob: Blob): Promise<void> {
    const formData = new FormData();

    formData.append('image', blob, nanoid());
    formData.append('queryId', queryId);
    formData.append('userId', userId.toString());

    try {
      await fetch(import.meta.env.VITE_API_URL + '/image', {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
      alert(e);
    }
  }

  /**
   * Creates stickerset with specified params
   * @param params - stickerset params
   */
  async function createStickerset(params: StickersetParams): Promise<void> {
    const formData = new FormData();

    formData.append('userId', params.userId.toString());
    formData.append('name', params.name);
    formData.append('title', params.title);
    formData.append('queryId', params.queryId);

    params.stickers.forEach(item => {
      formData.append('stickers', item.data, nanoid());
      formData.append('emojis', item.emojis);
    });

    try {
      await fetch(import.meta.env.VITE_API_URL + '/create-stickerset', {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
      alert(e);
    }
  }

  /**
   * Creates single sticker
   * @param params - sticker image data
   */
  async function createSingleSticker(params: SingleStickerParams): Promise<string | undefined> {
    const formData = new FormData();

    formData.append('userId', params.userId.toString());
    formData.append('sticker', params.data, nanoid());

    try {
      const result = await fetch(import.meta.env.VITE_API_URL + '/create-sticker', {
        method: 'POST',
        body: formData,
      });

      return (await result.json()).stickerId;
    } catch (e) {
      alert(e);
    }
  }

  /**
   * Checks if stickerset with specified short name already exists
   * @param name - stickerset short name
   */
  async function checkStickersetName(name: string): Promise<boolean> {
    try {
      const formData = new FormData();

      formData.append('name', name);

      const response = await fetch(import.meta.env.VITE_API_URL + '/check-shortname', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      return result.exists;
    } catch (e) {
      alert(e);
      return false;
    }
  }

  return {
    sendImageData,
    createStickerset,
    createSingleSticker,
    checkStickersetName,
  };
}

interface UseServer {
  sendImageData: (queryId: string, userId: number, blob: Blob) => Promise<void>;
  createStickerset: (params: StickersetParams) => Promise<void>;
  checkStickersetName: (name: string) => Promise<boolean>;
  createSingleSticker: (params: SingleStickerParams) => Promise<string | undefined>;
}
