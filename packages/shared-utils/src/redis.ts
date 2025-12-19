// packages/shared-utils/src/cache.ts (from worker/storefront, make shared)
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
let redis: Redis | null = null;
if (REDIS_URL) redis = new Redis(REDIS_URL);

export async function getRedisJSON(key: string): Promise<any | null> {
  if (!redis) return null;
  const raw = await redis.get(key);
  return raw ? JSON.parse(raw) : null;
}

export async function setRedisJSON(key: string, value: any, ttl: number): Promise<void> {
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}

export function blockKey(tenant: string, pageHash: string, blockId: string) {
  return `block:${tenant}:${pageHash}:${blockId}`;
}