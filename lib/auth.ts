import { createAuthClient } from "better-auth/react";
import { serverUrl } from "./evironment";
import { nextCookies } from "better-auth/next-js";

export const auth = createAuthClient({
  baseURL: serverUrl,
  basePath: "/authentications",
  plugins: [nextCookies()],
});