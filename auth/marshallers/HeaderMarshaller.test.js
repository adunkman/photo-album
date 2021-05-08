import { toLambdaFormat, toObj } from "./HeaderMarshaller";
import { anyRequest } from "../test/fixtures/ViewerRequestEvents";

test('toLambdaFormat converts standard javascript object to lambda format', () => {
  const headers = toLambdaFormat({
    'cache-control': 'max-age=100',
    'content-type': 'text/html',
  });

  expect(headers).toStrictEqual({
    'cache-control': [{ value: 'max-age=100' }],
    'content-type': [{ value: 'text/html' }],
  });
});

test('toLambdaFormat returns values in string form even if they are numbers and removes forbidden headers', () => {
  const headers = toLambdaFormat({
    'content-length': 155,
    'connection': 'keep-alive',
  });

  expect(headers).toStrictEqual({
    'content-length': [{ value: '155' }],
  });
});

test('toObj converts lambda header format into standard javascript object', () => {
  const headers = toObj(anyRequest.Records[0].cf.request.headers);

  expect(headers).toStrictEqual({
    "accept": "*/*",
    "host": "d111111abcdef8.cloudfront.net",
    "user-agent": "curl/7.66.0",
  });
});
