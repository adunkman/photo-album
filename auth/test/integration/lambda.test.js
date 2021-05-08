import { authorized } from "../fixtures/ViewerRequestEvents";
import { handler } from "../../lambda";

test.todo("it intercepts unauthorized requests with a redirect to the login page");

test.todo("it returns the login page when requested");

test.todo("it redirects token requests to remove the token and sets the token cookie");

test.todo("it passes unhandled authorized requests through to the upstream server"/*, async () => {
  const results = await handler(authorized);
  expect(results).toBe(authorized.Records[0].cf.request);
}*/);

test.todo("it handles logout requests and redirects to the login page");
