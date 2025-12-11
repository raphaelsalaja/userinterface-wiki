import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { Lenis } from "./lenis";
import { Theme } from "./theme";
import { Vercel } from "./vercel";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NuqsAdapter>
      <Lenis />
      <Vercel />
      <Theme />
      {children}
    </NuqsAdapter>
  );
};
