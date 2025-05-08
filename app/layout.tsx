if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = (input, init = {}) =>
    originalFetch(input, { ...init, credentials: "include" });
}

import React, { PropsWithChildren } from "react";
import "./globals.css";
import { ThemeProvider } from "@/lib/integrations/theme-provider";
import TanstackQueryClientProvider from "@/components/providers/tanstack-query-client-provider";

const RootLayout = ({children}: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryClientProvider>{children}</TanstackQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
