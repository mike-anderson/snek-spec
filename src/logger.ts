import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino({
  name: 'bounty-snake',
  level: isProd ? 'error' : 'debug',
  prettyPrint: !isProd,
});
