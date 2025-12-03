import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { Magic as MagicBase } from "magic-sdk";
import { createWalletClient, custom, WalletClient } from "viem";
import { POLYGON_RPC_URL } from "@/constants/polymarket";
import { polygon } from "viem/chains";

type MagicContextType = {
  magic: MagicBase | null;
  eoaAddress: string | undefined;
  email: string | undefined;
  walletClient: WalletClient | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

export const MagicContext = createContext<MagicContextType>({
  magic: null,
  eoaAddress: undefined,
  email: undefined,
  walletClient: null,
  connect: async () => {},
  disconnect: async () => {},
});

export default function useMagic() {
  return useContext(MagicContext);
}

export function MagicProvider({ children }: { children: ReactNode }) {
  const [magic, setMagic] = useState<MagicBase | null>(null);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [eoaAddress, setEoaAddress] = useState<string | undefined>(undefined);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY && !magic) {
      const magicInstance = new MagicBase(
        process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
        {
          network: {
            rpcUrl: POLYGON_RPC_URL,
            chainId: polygon.id,
          },
        }
      );

      const wallet = createWalletClient({
        chain: polygon,
        transport: custom(magicInstance.rpcProvider as any),
      });

      setMagic(magicInstance);
      setWalletClient(wallet);
    }
  }, [magic]);

  const fetchUser = useCallback(async (magicInstance: MagicBase) => {
    const userInfo = await magicInstance.user.getInfo();
    setEoaAddress((userInfo as any).wallets?.ethereum?.publicAddress);
    setEmail((userInfo as any).email);
  }, []);

  const connect = useCallback(async () => {
    if (!magic) return;
    try {
      await magic.wallet.connectWithUI();
      await fetchUser(magic);
    } catch (error) {
      console.error("Connect error:", error);
    }
  }, [magic, fetchUser]);

  const disconnect = useCallback(async () => {
    if (!magic) return;
    try {
      await magic.user.logout();
      setEoaAddress(undefined);
      setEmail(undefined);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }, [magic]);

  useEffect(() => {
    if (!magic) return;

    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        fetchUser(magic);
      }
    });
  }, [magic, fetchUser]);

  const value = useMemo(
    () => ({
      magic,
      eoaAddress,
      email,
      walletClient,
      connect,
      disconnect,
    }),
    [magic, eoaAddress, email, walletClient, connect, disconnect]
  );

  return (
    <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
  );
}
