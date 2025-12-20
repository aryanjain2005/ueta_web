// src/server/db.ts
import { drizzle } from 'drizzle-orm/d1';
import * as s from 'db/schema';

export function getDb(locals: any) {
  const { env } = locals.runtime;
  return drizzle(env.DB, { schema: s });
}
