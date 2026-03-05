import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { businesses, users } from "db/schema";
import * as schema from "db/schema";

export const POST: APIRoute = async ({ request, locals }) => {
  // 1. Check Auth
    const user = locals.user;
    if (!user) return new Response("Unauthorized", { status: 401 });
    //print data type of user.id
    console.log("📊 User ID type:", typeof user.id);

  try {
    const { env } = (locals as any).runtime;
    const db = drizzle(env.DB, { schema });
    const body = await request.json();

    console.log("🛠️ Backend received body:", body);

    // 2. Find the business_id for this user
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, parseInt(user.id, 10)),
    });

    if (!dbUser?.businessId) {
      return new Response("No business linked to this account", { status: 404 });
    }

    // 3. Update the business
    await db.update(businesses)
      .set({
        name: body.name,
        shopName: body.shopName,
        address: body.address,
        // Add other fields as needed
      })
      .where(eq(businesses.id, dbUser.businessId));

    console.log("✨ D1 Update successful for Business ID:", dbUser.businessId);
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("💀 D1 Update failed:", error.message);
    return new Response(error.message, { status: 500 });
  }
};