// src/pages/api/auth/getDistributors.ts
import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as s from 'db/schema';
import { getDistributorsList } from 'db/server';

export const GET: APIRoute = async ({ locals }) => {
  const { env } = (locals as any).runtime;
  const db = drizzle(env.DB, { schema: s });

  const distributors = await getDistributorsList(db);

  const result = distributors.map((d) => ({
      name: d.name,
      shopName: d.shopName,
    slug: d.slug,
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
