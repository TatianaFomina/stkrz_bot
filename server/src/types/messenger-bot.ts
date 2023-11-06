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


  /**
   * Stickers data
   */
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

export interface SingleStickerParams {
  /**
   * Id of the user who initiates creation of the stickerset
   */
  userId: number;

  /**
   * Sticker png image
   */
  image: Buffer;
}

export interface MessengerBot {
  /**
   * Creates stickerset based on specifie params
   *
   * @param params - stickerset params
   */
  createStickerset(params: StickersetParams): Promise<void>

  /**
   * Returns true if stickerset with specified name exists.
   * Otherwise returns false
   *
   * @param name - stickerset short name
   */
  checkStickersetExists(name: string): Promise<boolean>;

  /**
   * Creates single sticker.
   * Returns id of created sticker
   *
   * @param params - sticker params
   */
  createSingleSticker(params: SingleStickerParams): Promise<string | undefined>
}
