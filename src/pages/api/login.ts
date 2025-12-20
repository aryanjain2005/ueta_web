import { nanoid } from "nanoid";
import { SignJWT } from "jose";
import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import bcrypt from "bcryptjs";
import { users } from "../../db/schema";
import { SECRET, TOKEN } from "constant"; // ensure SECRET is a Uint8Array (key)

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  try {
    const { user: emailOrName, password } = await request.json();

    if (!emailOrName || !password) {
      return new Response(
        JSON.stringify({ message: "Please provide user and password" }),
        { status: 400 }
      );
    }

    // Connect to the database
    const db = drizzle(locals.runtime.env.DB, { schema: { users } });

    // Look up the user (email or name support; pick one)
    const found = await db.query.users.findFirst({
      where: (u, { eq, or }) => or(eq(u.email, emailOrName), eq(u.name, emailOrName)),
    });

    if (!found) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Compare password (bcrypt, safe!)
    const match = await bcrypt.compare(password, found.password);
    if (!match) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Sign JWT with full user info (customize payload as needed)
    const token = await new SignJWT({
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      type: found.type
    })
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(SECRET);

    cookies.set(TOKEN, token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2,
      sameSite: "lax",
      secure: false // set to true for production/https!
    });

    return new Response(
      JSON.stringify({ message: "You're logged in!" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.debug(error);
    return new Response(
      JSON.stringify({ message: "Login failed" }),
      { status: 500 }
    );
  }
};
