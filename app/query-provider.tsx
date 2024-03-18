"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [client] = React.useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children} <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
