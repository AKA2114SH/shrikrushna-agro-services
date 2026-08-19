// Centralized Environment Configuration & Startup Validation Module
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional().or(z.literal('')),
  AI_API_KEY: z.string().optional(),
  WHATSAPP_API_KEY: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  GITHUB_PAGES: z.enum(['true', 'false']).optional(),
  NEXT_EXPORT: z.enum(['true', 'false']).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnvironment(): EnvConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Environment configuration validation error:', parsed.error.format());
    if (process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES !== 'true') {
      throw new Error('Fatal: Invalid environment configuration in production!');
    }
  }

  const data = parsed.success ? parsed.data : (process.env as unknown as EnvConfig);

  // In production server mode, verify mandatory secrets
  const isStaticExport = data.GITHUB_PAGES === 'true' || data.NEXT_EXPORT === 'true';
  if (data.NODE_ENV === 'production' && !isStaticExport) {
    if (!data.JWT_SECRET) {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET must be set in production server environment!');
    }
    if (!data.DATABASE_URL) {
      console.warn('⚠️ WARNING: DATABASE_URL is not set. Persistent database operations will fall back to local store.');
    }
  }

  return data;
}

export const env = validateEnvironment();
export default env;
