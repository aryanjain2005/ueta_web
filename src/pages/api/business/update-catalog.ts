import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { businessBrandProduct, users, brands, products } from "db/schema";
import { eq } from "drizzle-orm";
import * as schema from "db/schema";

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { env } = (locals as any).runtime;
  const db = drizzle(env.DB, { schema });
  
  try {
    const { catalog } = await request.json(); 

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, parseInt(user.id, 10)),
    });

    const bId = dbUser?.businessId;
    if (!bId) return new Response("Business not found", { status: 404 });

    const allBrandsList = await db.select({ id: brands.id, slug: brands.slug }).from(brands);
    const allProductsList = await db.select({ id: products.id, slug: products.slug }).from(products);

    const brandMap = Object.fromEntries(allBrandsList.map((b) => [b.slug, b.id]));
    const productMap = Object.fromEntries(allProductsList.map((p) => [p.slug, p.id]));

    const newEntries: any[] = [];
    for (const [brandSlug, productSlugs] of Object.entries(catalog)) {
      const brandId = brandMap[brandSlug];
      if (!brandId) continue;

      (productSlugs as string[]).forEach(pSlug => {
        const productId = productMap[pSlug];
        if (productId) {
          newEntries.push({
            businessId: bId,
            brandId: brandId,
            productId: productId,
          });
        }
      });
    }

    await db.batch([
      db.delete(businessBrandProduct).where(eq(businessBrandProduct.businessId, bId)),
      ...(newEntries.length > 0 
        ? [db.insert(businessBrandProduct).values(newEntries)] 
        : [])
    ]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};