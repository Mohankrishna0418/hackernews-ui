"use client";

import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { tansackQueryClient } from "@/lib/integrations/tanstack-query";

const TanstackQueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={tansackQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default TanstackQueryClientProvider;
