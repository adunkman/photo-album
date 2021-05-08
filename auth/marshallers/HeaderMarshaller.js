export const forbiddenHeaders = [
  'connection',
  'content-length',
  'expect',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
  'x-accel-buffering',
  'x-accel-charset',
  'x-accel-limit-rate',
  'x-accel-redirect',
  'x-cache',
  'x-forwarded-proto',
  'x-real-ip',
];

export const toLambdaFormat = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([header, value]) => {
      if (!forbiddenHeaders.includes(header.toLowerCase())) {
        return [header, [{ value: `${value}` }]];
      }
    }).filter(x => x)
  );
};

export const toObj = (lambdaFormat) => {
  return Object.fromEntries(
    Object.entries(lambdaFormat).map(([header, values]) => {
      return [header, values[0].value];
    })
  )
};
