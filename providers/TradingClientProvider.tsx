"use client";

import { createContext, ReactNode } from "react";
import type { ClobClient } from "@polymarket/clob-client";
import type { RelayClient } from "@polymarket/builder-relayer-client";

export interface TradingClientContextType {
  clobClient: ClobClient | null;
  relayClient: RelayClient | null;
  eoaAddress: string | undefined;
  safeAddress: string | null;
}

export const TradingClientContext =
  createContext<TradingClientContextType | null>(null);

interface TradingClientProviderProps {
  children: ReactNode;
  clobClient: ClobClient | null;
  relayClient: RelayClient | null;
  eoaAddress: string | undefined;
  safeAddress: string | null;
}

export default function TradingClientProvider({
  children,
  clobClient,
  relayClient,
  eoaAddress,
  safeAddress,
}: TradingClientProviderProps) {
  return (
    <TradingClientContext.Provider
      value={{ clobClient, relayClient, eoaAddress, safeAddress }}
    >
      {children}
    </TradingClientContext.Provider>
  );
}
