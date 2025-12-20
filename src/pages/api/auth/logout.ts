import type { APIRoute } from "astro";
import { TOKEN } from "../../../constant";

export const POST: APIRoute = async (ctx) => {
  try {
    // Clear the auth cookie immediately
    ctx.cookies.set(TOKEN, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    console.log("Logged out successfully");

    // Redirect client to home page to refresh UI and auth state
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  } catch (error) {
    console.debug(error);
    return new Response(
      JSON.stringify({
        message: "Logout failed",
      }),
      { status: 500 }
    );
  }
};
