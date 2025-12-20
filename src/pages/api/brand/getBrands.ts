// src/pages/api/brand/getBrands.ts
import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as s from 'db/schema';
import { getBrands } from 'db/server';

export const GET: APIRoute = async ({ locals }) => {
  const { env } = (locals as any).runtime;
  const db = drizzle(env.DB, { schema: s });

  // Ask for IDs so SearchBar can map them
  const brands = await getBrands(db);

  // Map to the shape SearchBar uses: { name, objectId }
  const result = brands.map((b) => ({
    name: b.name,
    objectId: b.id, // or _id depending on your schema
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
