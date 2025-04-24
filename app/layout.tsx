import "./globals.css";
import React, { PropsWithChildren } from "react";
import { Providers } from "./providers";

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html>
      <body>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;