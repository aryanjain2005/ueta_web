// src/pages/api/auth/getDealers.ts
import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as s from 'db/schema';
import { getDealersList } from 'db/server';

export const GET: APIRoute = async ({ locals }) => {
  const { env } = (locals as any).runtime;
  const db = drizzle(env.DB, { schema: s });

  const dealers = await getDealersList(db);
    console.log("[API:getDealers] raw dealers from DB:", dealers);
  const result = dealers.map((d) => ({
      name: d.name,
      shopName: d.shopName,
    slug: d.slug,
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
