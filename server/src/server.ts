import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'path';
import fastify from 'fastify';
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify';
import { MessengerBot, StickersetParams } from './types/messenger-bot';


/**
 * HTTP server
 */
export class Server {
  /** Port server listens to */
  private PORT = 3000;

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

    console.log(publicAbsolutePath);
    server.register(cors, {});
    server.register(multipart, { attachFieldsToBody: true });
    server.register(staticPlugin, {
      root: publicAbsolutePath,
    });

    return server;
  }

  /**
   * Attaches request handlers
   */
  private attachHandlers(): void {
    this.fastify.post('/create-stickerset', this.createStickerset);
  }

  /**
   * Handles request to create new stickerset
   *
   * @param request - request data
   * @param reply - reply object
   */
  private createStickerset = async (request: FastifyRequest, reply: FastifyReply): Promise<void> =>  {
    try {
      const body: any = request.body; // @todo remove any

      const params: StickersetParams = {
        stickers: [],
        userId: body.userId.value,
        queryId: body.queryId.value,
        name: body.name.value,
        title: body.title.value,
      };

      for (let i = 0; i < body.stickers.length; i++) {
        const image = await body.stickers[i].toBuffer();

        params.stickers.push({
          image,
          emojis: body.emojis[i].value,
        });
      }

      await this.bot.createStickerset(params);

      reply.code(200).send();
    } catch (e) {
      console.error((e as Error).message);

      reply.code(500).send((e as Error).message);
    }
  };
}
