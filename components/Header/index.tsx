"use client";

import useMagic from "@/providers/MagicProvider";
import WalletInfo from "@/components/Header/WalletInfo";

export default function Header({
  onEndSession,
}: {
  onEndSession?: () => void;
}) {
  const { eoaAddress, connect, disconnect } = useMagic();

  const handleDisconnect = async () => {
    try {
      onEndSession?.();
      await disconnect();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      {eoaAddress ? (
        <WalletInfo onDisconnect={handleDisconnect} />
      ) : (
        <button
          className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 hover:bg-white/20 cursor-pointer transition-colors font-semibold select-none"
          onClick={connect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
