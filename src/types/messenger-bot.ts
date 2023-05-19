import { Buffer } from 'node:buffer';

export interface StickersetParams {
  /**
   * Id of the user who initiates creation of the stickerset
   */
  userId: number;

  /**
   * Web App query id
   */
  queryId: string;

  /**
   * Unique stickerset name
   */
  name: string;

  /**
   * Stickerset title
   */
  title: string;


  stickers: Array<{
    /**
     * Sticker png image
     */
    image: Buffer;
    /**
     * String with emojis representing sticker
     */
    emojis: string;
  }>
}

export interface MessengerBot {
  /**
   * Creates stickerset based on specifie params
   *
   * @param params - stickerset params
   */
  createStickerset(params: StickersetParams): Promise<void>
}
