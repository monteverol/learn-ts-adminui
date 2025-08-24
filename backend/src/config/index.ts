import { env } from './env';

export const config = {
  env: env.NODE_ENV,
  port: Number(env.PORT),
  corsOrigin: env.CORS_ORIGIN ?? '*',
};