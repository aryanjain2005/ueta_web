import type { APIRoute } from "astro";
import { jwtVerify } from "jose";
import { TOKEN, SECRET } from "constant";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get(TOKEN);
    if (!token) return new Response(null, { status: 401 });

    const { payload } = await jwtVerify(token.value, SECRET);
    return new Response(JSON.stringify({ user: payload }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(null, { status: 401 });
  }
};
