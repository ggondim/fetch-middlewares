import { EJSON } from 'bson';

export default async (next) => async (request, options) => {
  //
  // BEFORE
  // Modify/Use Request
  //
  if (options
    && typeof options.body === 'object'
    && options.ejson !== false) {
    options.body = EJSON.stringify(options.body);
  }
  
  const response = await next(request, options);

  if (response.headers
    && options.ejson !== false
    && response.headers.has('Content-Type')
    && response.headers.get('Content-Type').indexOf('json') !== -1
  ) {
    const text = await response.text();
    try {
      const parsed = EJSON.parse(text);
      response.json = async () => parsed;
      response.text = async () => text;
    } catch (error) {
      response.ejsonError = error;
    }
  }

  return response;
};
