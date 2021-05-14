import "dotenv/config";
import { toLambdaFormat, toObj } from "./marshallers/HeaderMarshaller";
import { createServer } from "./lib/Server";

export const handler = async (event) => {
  const request = event.Records[0].cf.request;
  const server = await createServer();
  await server.initialize();

  // Require default authentication on all routes.
  server.route({
    method: '*',
    path: '/{param*}',
    handler: (request, h) => h.response().code(404),
  });

  const qs = request.querystring;
  const response = await server.inject({
    method: request.method,
    url: `${request.uri}${qs ? `?${qs}` : ''}`,
    headers: toObj(request.headers),
    payload: Buffer.from(request.body.data, 'base64'),
  });

  if (response.statusCode === 404) {
    // Returning the request passes the request along to the upstream server
    return request;
  }

  const res = {
    body: response.rawPayload.toString('base64'),
    bodyEncoding: 'base64',
    headers: toLambdaFormat(response.headers),
    status: response.statusCode,
    statusDescription: response.statusMessage,
  };

  return res;
};
