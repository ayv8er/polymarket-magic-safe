"use client";

import useMagic from "@/providers/MagicProvider";
import useClobClient from "@/hooks/useClobClient";
import useSafeDeployment from "@/hooks/useSafeDeployment";
import useTradingSession from "@/hooks/useTradingSession";
import TradingClientProvider from "@/providers/TradingClientProvider";

import Header from "@/components/Header";
import PolygonAssets from "@/components/PolygonAssets";
import TradingSession from "@/components/TradingSession";
import MarketTabs from "@/components/Trading/MarketTabs";

export default function Home() {
  const { eoaAddress } = useMagic();
  const { derivedSafeAddressFromEoa } = useSafeDeployment(eoaAddress);

  const {
    tradingSession,
    currentStep,
    sessionError,
    isTradingSessionComplete,
    initializeTradingSession,
    endTradingSession,
    relayClient,
  } = useTradingSession();

  const { clobClient } = useClobClient(
    tradingSession,
    isTradingSessionComplete,
    relayClient
  );

  return (
    <div className="p-6 min-h-screen flex flex-col gap-6 max-w-7xl mx-auto">
      <Header onEndSession={endTradingSession} />
      <PolygonAssets />
      <TradingSession
        session={tradingSession}
        currentStep={currentStep}
        error={sessionError}
        isComplete={isTradingSessionComplete}
        initialize={initializeTradingSession}
        endSession={endTradingSession}
      />
      {isTradingSessionComplete && eoaAddress && (
        <TradingClientProvider
          clobClient={clobClient}
          relayClient={relayClient}
          eoaAddress={eoaAddress}
          safeAddress={derivedSafeAddressFromEoa}
        >
          <MarketTabs />
        </TradingClientProvider>
      )}
    </div>
  );
}
