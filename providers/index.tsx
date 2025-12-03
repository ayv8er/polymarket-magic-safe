"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { MagicProvider } from "./MagicProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MagicProvider>
      <QueryProvider>{children}</QueryProvider>
    </MagicProvider>
  );
}
