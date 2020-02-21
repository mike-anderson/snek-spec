import { CustomError } from './errors';

/**
 * Don't worry about anything in this file,
 * focus on writing your snake logic in index.js endpoints.
 */

const poweredByHandler = (_, res, next): void => {
  res.setHeader('X-Powered-By', 'Battlesnake');
  next();
};

const fallbackHandler = (req, res, next): Express.Response => {
  console.dir(req.baseUrl);
  // Root URL path
  if (req.baseUrl === '') {
    res.status(200);
    return res.send(`
      Battlesnake documentation can be found at
       <a href="https://docs.battlesnake.io">https://docs.battlesnake.io</a>.
    `);
  }

  // Short-circuit favicon requests
  if (req.baseUrl === '/favicon.ico') {
    res.set({ 'Content-Type': 'image/x-icon' });
    res.status(200);
    res.end();
    return next();
  }

  // Reroute all 404 routes to the 404 handler
  const err = new CustomError('Not found', { status: 404 });
  return next(err);
};

const notFoundHandler = (err, _, res, next): Express.Response => {
  if (err.status !== 404) {
    return next(err);
  }

  res.status(404);
  return res.send({
    status: 404,
    error: err.message || "These are not the snakes you're looking for",
  });
};

const genericErrorHandler = (err, _, res): Express.Response => {
  const { status } = err;

  res.status(status);
  return res.send({
    error: err,
    status,
  });
};

export {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler,
};
