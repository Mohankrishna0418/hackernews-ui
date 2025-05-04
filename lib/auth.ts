// lib/integrations/better-auth/index.ts

import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { usernameClient } from "better-auth/client/plugins";

export const url =
  // "https://hackernews.lemonisland-20d31e0a.centralindia.azurecontainerapps.io";
  "http://localhost:3000";

export const auth = createAuthClient({
  baseURL: `${url}`,
  plugins: [usernameClient(), nextCookies()],
});
