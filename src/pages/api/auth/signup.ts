import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../../db/schema";
import bcrypt from "bcryptjs";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { name, email, password, img, role, type } = body;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, email, and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

  const db = drizzle(locals.runtime.env.DB, { schema: { users } });

    const existing = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: "User already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashed,
      img: img || null,
      role: role || "dealer",
      type: type || "standard",
      createdAt: new Date(),
    }).execute();

    return new Response(
      JSON.stringify({
        success: true,
        user: { name, email, role, type, img },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Signup API error:", err);
    return new Response(
      JSON.stringify({
        error: "Server error",
        details: typeof err === "object" && err !== null && "message" in err ? (err as { message?: string }).message : String(err)
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};



