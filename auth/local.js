import { createServer } from "./lib/Server";
import h2o2 from "@hapi/h2o2";
import Wreck from "@hapi/wreck";

export const start = async () => {
  const server = await createServer();
  await server.register(h2o2);

  server.route({
    method: '*',
    path: '/{param*}',
    options: {
      cors: true,
    },
    handler: {
      proxy: {
        host: 'hugo',
        port: 1313,
        protocol: 'http',
        passThrough: true,
        xforward: true,
        onResponse: async function (err, res, request, h, settings, ttl) {
          const payload = await Wreck.read(res);
          const body = payload.toString("utf-8");

          const reply = body.includes('<!DOCTYPE html>')
            ? body.replace(/localhost:1313/gi, 'localhost:3000')
            : payload;

          const response = h.response(reply);
          response.headers = res.headers;
          return response;
        }
      },
    },
  });

  await server.start();

  console.log(`Server started at: http://localhost:${server.info.port}`);
};

start();
