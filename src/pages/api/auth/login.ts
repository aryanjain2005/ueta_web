import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import bcrypt from "bcryptjs";
import { users } from "../../../db/schema";
import { SECRET, TOKEN } from "../../../constant";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  let emailOrName, password;

  // Support both FormData and JSON post
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    emailOrName = body.user;
    password = body.password;
  } else {
    const data = await request.formData();
    emailOrName = data.get("user") as string;
    password = data.get("password") as string;
  }

  if (!emailOrName || !password) {
    return new Response("User and password required", { status: 400, headers: { "Content-Type": "text/plain" } });
  }

  const db = drizzle(locals.runtime.env.DB, { schema: { users } });
  const found = await db.query.users.findFirst({
    where: (u, { eq, or }) => or(eq(u.email, emailOrName), eq(u.name, emailOrName)),
  });

  if (!found || !(await bcrypt.compare(password, found.password))) {
    return new Response("Invalid credentials", { status: 401, headers: { "Content-Type": "text/plain" } });
  }

  const token = await new SignJWT({
    id: found.id,
    email: found.email,
    name: found.name,
    role: found.role,
    type: found.type,
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
    secure: process.env.NODE_ENV === "production",
  });

  return new Response(null, { status: 302, headers: { Location: "/" } });
};
