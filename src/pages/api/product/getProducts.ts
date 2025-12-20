// src/pages/api/product/getProducts.ts
import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as s from 'db/schema';
import { getProducts } from 'db/server';

export const GET: APIRoute = async ({ locals }) => {
  const { env } = (locals as any).runtime;
  const db = drizzle(env.DB, { schema: s });

  const products = await getProducts(db);

  const result = products.map((p) => ({
    name: p.name,
    slug: p.slug,
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
