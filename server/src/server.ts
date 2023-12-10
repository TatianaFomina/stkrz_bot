import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'path';
import fastify from 'fastify';
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify';
import { MessengerBot, StickersetParams } from './types/messenger-bot';
import { ERROR_MESSAGE_FORBIDDEN } from '../../common/const.js';


/**
 * HTTP server
 */
export class Server {
  /** Port server listens to */
  private PORT = process.env.PORT !== undefined ? parseInt(process.env.PORT) : 3000;

  /** Fastify instance */
  private readonly fastify;

  /**
   * Constructs server instance
   *
   * @param bot - messenger bot instance
   */
  constructor(private bot: MessengerBot) {
    this.fastify = this.createServer();

    this.attachHandlers();
  }

  /**
   * Starts the server
   */
  public start(): void {
    this.fastify.listen({ port: this.PORT }, (error, address) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    });
  }

  /**
   * Creates the server and registers plugins
   */
  private createServer(): ReturnType<typeof fastify> {
    const publicAbsolutePath = path.join(path.resolve(), '..', 'webapp', 'dist');
    const server = fastify();

    server.register(cors, {});
    server.register(multipart, { attachFieldsToBody: true });
    server.register(staticPlugin, {
      root: publicAbsolutePath,
    });
    server.setNotFoundHandler((request, reply) => {
      reply.sendFile('index.html');
    });

    return server;
  }

  /**
   * Attaches request handlers
   */
  private attachHandlers(): void {
    this.fastify.post('/create-stickerset', this.createStickerset.bind(this));
    this.fastify.post('/create-sticker', this.createSingleSticker.bind(this));
    this.fastify.post('/check-shortname', this.checkStickersetExists.bind(this));
  }

  /**
   * Handles request to create new stickerset
   *
   * @param request - request data
   * @param reply - reply object
   */
  private async createStickerset(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body: any = request.body; // @todo remove any

      const params: StickersetParams = {
        stickers: [],
        userId: body.userId.value,
        queryId: body.queryId.value,
        name: body.name.value,
        title: body.title.value,
      };

      if (body.stickers.length === undefined) {
        /** Stickers array contains single element */
        const image = await body.stickers.toBuffer();

        params.stickers.push({
          image,
          emojis: body.emojis.value,
        });
      } else {
        /** Stickers array contains multiple elements */
        for (let i = 0; i < body.stickers.length; i++) {
          const image = await body.stickers[i].toBuffer();

          params.stickers.push({
            image,
            emojis: body.emojis[i].value,
          });
        }
      }

      await this.bot.createStickerset(params);

      reply.code(200).send();
    } catch (e) {
      console.error((e as Error).message);

      reply.code(500).send((e as Error).message);
    }
  }

  /**
   * Handles request to check stickerset existance
   *
   * @param request - request data
   * @param reply - response object
   */
  private async checkStickersetExists(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const name = (request.body as any).name.value;
      const exists = await this.bot.checkStickersetExists(name);

      reply.code(200).send({ exists });
    } catch (e) {
      console.error((e as Error).message);

      reply.code(500).send((e as Error).message);
    }
  }

  /**
   * Creates single sticker.
   * Returns id of created sticker
   *
   * @param request - request data
   * @param reply - response object
   */
  private async createSingleSticker(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body: any = request.body; // @todo remove any

    try {
      const stickerParams = {
        userId: body.userId.value,
        image: await body.sticker.toBuffer(),
      };

      const stickerId = await this.bot.createSingleSticker(stickerParams);

      if (stickerId === undefined) {
        throw new Error('Failed to create sticker');
      }

      reply.code(200).send({ stickerId });
    } catch (e) {
      const error = e as Error;

      console.error(error);

      if (error.message === ERROR_MESSAGE_FORBIDDEN) {
        return reply.code(403).send({ error: error.message });
      }

      reply.code(500).send({ error: (e as Error).message });
    }
  }
}
