import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, locals }) => {
  const { env } = locals.runtime;
  const path = params.path;

  if (!path) return new Response("Path missing", { status: 400 });

  // Use the 'MY_BUCKET' binding from wrangler.toml
  const object = await (env.MY_BUCKET as any).get(path);

  if (!object) return new Response("Image Not Found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  // Cache for 7 days so it's fast for your Udaipur users
  headers.set("Cache-Control", "public, max-age=604800"); 

  return new Response(object.body, { headers });
};