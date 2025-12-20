export const TOKEN = "token";
export const PUBLIC_ROUTES = [
  /^\/$/,
  /^\/brand\/.*/,
  /^\/product\/.*/,
  /^\/dealer.*/,
  /\/login/,
  /\/signup/,
  /\/api.*/,
  /\/404.*/,
  /\/media.*/,
];
export const SECRET = new TextEncoder().encode("SECRET");

export const VITE_API_URL = "https://ueta-back.psh.workers.dev";
