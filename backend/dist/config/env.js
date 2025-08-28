import 'dotenv/config';
import { z } from 'zod';
const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string().url(),
    CORS_ORIGIN: z.string().optional(),
});
export const env = EnvSchema.parse(process.env);
