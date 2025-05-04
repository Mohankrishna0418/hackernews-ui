// app/layout.tsx
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = (input, init = {}) =>
    originalFetch(input, { ...init, credentials: "include" });
}

import React, { PropsWithChildren } from "react";
import "./globals.css";

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

export default RootLayout;
