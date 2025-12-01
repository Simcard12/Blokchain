import { ethers } from 'ethers';
import AuctionMarketplaceArtifact from '../contracts/AuctionMarketplace.json';
import { AUCTION_MARKETPLACE_ADDRESS } from '../contracts/address';
import { Auction, AuctionStatus } from '../types';

export const Web3Service = {
    getProvider: () => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            return new ethers.BrowserProvider((window as any).ethereum);
        }
        return new ethers.JsonRpcProvider("https://sepolia.drpc.org");
    },

    getAllAuctions: async (): Promise<Auction[]> => {
        try {
            const provider = Web3Service.getProvider();
            const contract = new ethers.Contract(
                AUCTION_MARKETPLACE_ADDRESS,
                AuctionMarketplaceArtifact.abi,
                provider
            );

            // Fetch auctions (limit 50 for now)
            const data = await contract.getAuctions(0, 50);

            return data.map((item: any) => {
                const now = Math.floor(Date.now() / 1000);
                const startTime = Number(item.startTime);
                const endTime = Number(item.endTime);

                let status = AuctionStatus.UPCOMING;

                if (item.cancelled) {
                    status = AuctionStatus.CANCELLED;
                } else if (item.ended || endTime < now) {
                    status = AuctionStatus.ENDED;
                } else if (startTime <= now && endTime > now) {
                    status = AuctionStatus.LIVE;
                }

                return {
                    id: item.id.toString(),
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    sellerAddress: item.auctioneer,
                    imageUrl: item.imageHash,
                    startPrice: parseFloat(ethers.formatEther(item.minBidIncrement)),
                    currentBid: parseFloat(ethers.formatEther(item.highestBid)),
                    highestPayableBid: parseFloat(ethers.formatEther(item.highestPayableBid)),
                    bidIncrement: parseFloat(ethers.formatEther(item.minBidIncrement)),
                    startTime: startTime,
                    endTime: endTime,
                    status: status,
                    bids: [],
                    isVerified: true
                };
            });
        } catch (error) {
            console.error("Error fetching auctions:", error);
            return [];
        }
    },

    getAuctionById: async (auctionId: string): Promise<Auction | null> => {
        try {
            const provider = Web3Service.getProvider();
            const contract = new ethers.Contract(
                AUCTION_MARKETPLACE_ADDRESS,
                AuctionMarketplaceArtifact.abi,
                provider
            );

            const item = await contract.getAuction(auctionId);

            const now = Math.floor(Date.now() / 1000);
            const startTime = Number(item.startTime);
            const endTime = Number(item.endTime);

            let status = AuctionStatus.UPCOMING;

            if (item.cancelled) {
                status = AuctionStatus.CANCELLED;
            } else if (item.ended || endTime < now) {
                status = AuctionStatus.ENDED;
            } else if (startTime <= now && endTime > now) {
                status = AuctionStatus.LIVE;
            }

            return {
                id: item.id.toString(),
                title: item.title,
                description: item.description,
                category: item.category,
                sellerAddress: item.auctioneer,
                imageUrl: item.imageHash,
                startPrice: parseFloat(ethers.formatEther(item.minBidIncrement)),
                currentBid: parseFloat(ethers.formatEther(item.highestBid)),
                highestPayableBid: parseFloat(ethers.formatEther(item.highestPayableBid)),
                bidIncrement: parseFloat(ethers.formatEther(item.minBidIncrement)),
                startTime: startTime,
                endTime: endTime,
                status: status,
                bids: [],
                isVerified: true
            };
        } catch (error) {
            console.error("Error fetching auction:", error);
            return null;
        }
    },

    getPendingReturns: async (address: string): Promise<string> => {
        try {
            const provider = Web3Service.getProvider();
            const contract = new ethers.Contract(
                AUCTION_MARKETPLACE_ADDRESS,
                AuctionMarketplaceArtifact.abi,
                provider
            );

            const pendingReturns = await contract.pendingReturns(address);
            return ethers.formatEther(pendingReturns);
        } catch (error) {
            console.error("Error fetching pending returns:", error);
            return "0";
        }
    }
};
