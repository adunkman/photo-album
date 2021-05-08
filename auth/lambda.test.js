jest.mock('./lib/Server');

import { createServer } from "./lib/Server";
import { handler } from "./lambda";
import { anyRequest } from "./test/fixtures/ViewerRequestEvents";

let server;

beforeEach(() => {
  server = {
    initialize: jest.fn().mockImplementation(() => {}),
    inject: jest.fn().mockImplementation(() => ({
      statusCode: 404
    })),
  };

  createServer.mockReturnValue(server);
})

test('calls the server in the correct format', async () => {
  await handler(anyRequest);

  expect(server.inject).toHaveBeenCalledWith({
    method: 'GET',
    url: '/?page=1',
    headers: {
      "accept": "*/*",
      "host": "d111111abcdef8.cloudfront.net",
      "user-agent": "curl/7.66.0",
    },
    payload: undefined,
  });
});

test('if the server returns 404, the request is allowed', async () => {
  server.inject.mockImplementation(() => ({
    statusCode: 404
  }));

  const response = await handler(anyRequest);

  // Cloudfront allows requests to proceed if the request object is returned
  expect(response).toBe(anyRequest.Records[0].cf.request);
});

test('if the server returns a response, the response is returned in the correct format', async () => {
  server.inject.mockImplementation(() => ({
    statusCode: 302,
    statusMessage: 'Found',
    headers: {
      'location': '/'
    },
  }));

  const response = await handler(anyRequest);

  expect(response).toStrictEqual({
    status: 302,
    statusDescription: 'Found',
    headers: {
      'location': [
        { value: '/' }
      ]
    },
    body: undefined,
  });
});
