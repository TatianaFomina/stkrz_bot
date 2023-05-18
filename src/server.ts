import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import { EventEmitter } from 'node:events';
import { pipeline } from 'stream/promises';
import fs from 'fs';
import path from 'path';

/**
 * Initializes http server
 *
 * @param eventBus - common event bus used to transfer messages
 */
export async function init(eventBus: EventEmitter): Promise<void> {
  const PORT = 3000;
  const publicDir = 'public';
  const publicAbsolutePath = path.join(path.resolve(), publicDir);
  const server = fastify();

  await server.register(cors, {});
  await server.register(multipart, { attachFieldsToBody: true });
  await server.register(staticPlugin, {
    root: publicAbsolutePath,
    prefix: `/${publicDir}/`,
  });

  server.post('/image', async (request, response) => {
    const parts = request.parts();
    let queryId = '';
    let userId = -1;
    let filePath = '';

    /**
     * Handle form data
     */
    for await (const data of parts) {
      if (data.type === 'file') {
        const filename = data.filename + '.png';
        const absolutePath = path.join(publicAbsolutePath, filename);

        filePath = path.join(publicDir, filename);

        await pipeline(data.file, fs.createWriteStream(absolutePath));
      } else if (data.fieldname === 'queryId') {
        queryId = data.value as string;
      } else if (data.fieldname === 'userId') {
        userId = parseInt(data.value as string);
      }
    }

    eventBus.emit('image-received', {
      path: filePath,
      queryId: queryId,
      userId: userId,
    });

    response.send();
  });

  server.post('/create-stickerset', async (request: any, response) => {
    const image = await request.body.image.toBuffer();


    eventBus.emit('create-stickerset', {
      image,
      userId: request.body.userId.value,
      name: request.body.name.value,
      title: request.body.title.value,
      emojis: request.body.emojis.value,
    });
  });


  server.listen({ port: PORT }, (error, address) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`Server listening at ${address}`);
  });
}
