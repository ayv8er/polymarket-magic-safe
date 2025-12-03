import { useMemo } from "react";
import { providers } from "ethers";
import useMagic from "@/providers/MagicProvider";
import { ClobClient } from "@polymarket/clob-client";
import useSafeDeployment from "@/hooks/useSafeDeployment";
import { RelayClient } from "@polymarket/builder-relayer-client";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";

import { TradingSession } from "@/utils/session";
import {
  CLOB_API_URL,
  POLYGON_CHAIN_ID,
  REMOTE_SIGNING_URL,
} from "@/constants/polymarket";

// This hook creates the authenticated clobClient with the User API Credentials
// and the builder config credentials, but only after a trading session is initialized

export default function useClobClient(
  tradingSession: TradingSession | null,
  isTradingSessionComplete: boolean | undefined,
  relayClient: RelayClient | null
) {
  const { eoaAddress, walletClient } = useMagic();
  const { derivedSafeAddressFromEoa } = useSafeDeployment(eoaAddress);

  const clobClient = useMemo(() => {
    if (
      !walletClient ||
      !eoaAddress ||
      !derivedSafeAddressFromEoa ||
      !isTradingSessionComplete ||
      !tradingSession?.apiCredentials ||
      !relayClient
    ) {
      return null;
    }

    try {
      const provider = new providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();

      // Builder config with remote server signing for order attribution
      const builderConfig = new BuilderConfig({
        remoteBuilderConfig: {
          url: REMOTE_SIGNING_URL(),
        },
      });

      // This is the persisted clobClient instance for creating and posting
      // orders for the user, with proper builder order attribution
      return new ClobClient(
        CLOB_API_URL,
        POLYGON_CHAIN_ID,
        signer,
        tradingSession.apiCredentials,
        2, // signatureType = 2 for embedded wallet EOA to sign for Safe proxy wallet
        derivedSafeAddressFromEoa,
        undefined, // mandatory placeholder
        false,
        builderConfig // Builder order attribution
      );
    } catch (error) {
      console.error("Failed to initialize CLOB client:", error);
      return null;
    }
  }, [
    walletClient,
    eoaAddress,
    derivedSafeAddressFromEoa,
    isTradingSessionComplete,
    tradingSession?.apiCredentials,
    relayClient,
  ]);

  return { clobClient };
}
