import { defineMiddleware } from "astro:middleware";
import { PUBLIC_ROUTES, SECRET, TOKEN } from "constant";
import { errors, jwtVerify } from "jose";

const verifyAuth = async (token?: string) => {
  if (!token) {
    return {
      status: "unauthorized",
      msg: "please pass a request token",
    } as const;
  }

  try {
    const jwtVerifyResult = await jwtVerify(token, SECRET);
    return {
      status: "authorized",
      payload: jwtVerifyResult.payload,
      msg: "successfully verified auth token",
    } as const;
  } catch (err) {
    if (err instanceof errors.JOSEError) {
      return { status: "error", msg: err.message } as const;
    }
    console.debug(err);
    return { status: "error", msg: "could not validate auth token" } as const;
  }
};

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get(TOKEN)?.value;
  const validationResult = await verifyAuth(token);
  if (validationResult.status === "authorized") {
    // @ts-ignore
    context.locals.user = validationResult.payload;
  }
  if (PUBLIC_ROUTES.some((route) => route.test(context.url.pathname))) {
    return next();
  }

  switch (validationResult.status) {
    case "authorized":
      return next();

    case "error":
    case "unauthorized":
      if (context.url.pathname.startsWith("/api/")) {
        return new Response(JSON.stringify({ message: validationResult.msg }), {
          status: 401,
        });
      } else {
        const urlToRedirect = new URL("/login", context.url);
        urlToRedirect.searchParams.set("r", context.url.pathname);
        return Response.redirect(urlToRedirect);
      }

    default:
      return Response.redirect(new URL("/", context.url));
  }
});
