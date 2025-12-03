import { useContext } from "react";
import {
  TradingClientContext,
  TradingClientContextType,
} from "@/providers/TradingClientProvider";

export default function useTradingClient(): TradingClientContextType {
  const context = useContext(TradingClientContext);
  if (!context) {
    throw new Error(
      "useTradingClient must be used within TradingClientProvider"
    );
  }
  return context;
}
