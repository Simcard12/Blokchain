import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import AuctionMarketplaceArtifact from '../contracts/AuctionMarketplace.json';
import { AUCTION_MARKETPLACE_ADDRESS } from '../contracts/address';

interface Web3ContextType {
  account: string | null;
  balance: string;
  chainId: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  formatAddress: (addr: string) => string;
  contract: ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const connectWallet = async () => {
    setIsConnecting(true);

    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);

        // Switch to Sepolia
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia Chain ID
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await (window as any).ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Test Network',
                    rpcUrls: ['https://sepolia.infura.io/v3/'],
                    nativeCurrency: {
                      name: 'SepoliaETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                  },
                ],
              });
            } catch (addError) {
              console.error("Failed to add Sepolia network", addError);
            }
          }
        }

        const network = await provider.getNetwork();

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setChainId(network.chainId.toString());
          const bal = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(bal));

          // Initialize contract
          const signer = await provider.getSigner();
          const auctionContract = new ethers.Contract(
            AUCTION_MARKETPLACE_ADDRESS,
            AuctionMarketplaceArtifact.abi,
            signer
          );
          setContract(auctionContract);
        }
      } catch (err) {
        console.error("User rejected connection or error", err);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }

    setIsConnecting(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
    setContract(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Re-connect to update signer/contract if needed, or just reload
          window.location.reload();
        } else {
          setAccount(null);
          setContract(null);
        }
      });

      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, balance, chainId, isConnecting, connectWallet, disconnectWallet, formatAddress, contract }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

