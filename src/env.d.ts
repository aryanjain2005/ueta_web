// src/env.d.ts

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Env = {
  DB: D1Database;
};

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user?: {
      id: string;
      name: string;
      role: string;
      img?: string;
      email: string;
      type: string;
      exp?: number;
      iat?: number;
    };
  }
}
