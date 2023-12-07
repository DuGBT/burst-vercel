import { useConnectWallet } from "@web3-onboard/react";

const Wallet = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  return (
    <div>
      <button
        disabled={connecting}
        onClick={() => {
          wallet ? disconnect(wallet) : connect();
        }}
      >
        Connect
      </button>
    </div>
  );
};

export default Wallet;
