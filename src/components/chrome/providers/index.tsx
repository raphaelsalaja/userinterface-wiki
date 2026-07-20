"use client";

import { Toast } from "@base-ui/react/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Agentation } from "agentation";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <SpeedInsights />
        <Analytics />
        <ThemeProvider attribute="class">
          <Toast.Provider>{children}</Toast.Provider>
        </ThemeProvider>
      </NuqsAdapter>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </QueryClientProvider>
  );
};
