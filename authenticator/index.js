const URL = require('url').URL;
const credentials = require('./credentials.json');

const appendIndexFile = (url) => {
  if (!url.pathname.includes('.')) {
    url.pathname = url.pathname.replace(/\/?$/, '\/index.html');
  }

  return url.toString();
};

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const authorization = request.headers.authorization;
  const authString = 'Basic ' + Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

  if (authorization && authorization[0] && authorization[0].value === authString) {
    // Rewrite request URI to append "index.html" if root directory request.
    request.uri = appendIndexFile(new URL(request.uri));

    // Allow request
    return request;
  }

  // Request credentials
  return {
    status: '401',
    statusDescription: 'Unauthorized',
    body: 'Unauthorized',
    headers: {
      'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
    },
  };
};
