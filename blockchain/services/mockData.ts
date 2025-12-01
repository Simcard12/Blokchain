import { Auction, AuctionStatus, Bid, Category } from '../types';

// Helper to generate dates
const now = Date.now();
const hour = 3600 * 1000;
const day = 24 * hour;

export const MOCK_AUCTIONS: Auction[] = [
  {
    id: '1',
    title: 'Cyberpunk Golden Ape #4021',
    description: 'A rare digital collectible from the original Cyberpunk Ape collection. Features gold skin traits and holographic visor.',
    category: 'Art',
    sellerAddress: '0x71C...9A21',
    imageUrl: 'https://picsum.photos/id/237/800/800', // Dog as placeholder
    startPrice: 0.5,
    currentBid: 1.2,
    highestPayableBid: 1.15,
    bidIncrement: 0.05,
    startTime: now - day,
    endTime: now + 4 * hour,
    status: AuctionStatus.LIVE,
    isVerified: true,
    bids: [
      { id: 'b1', bidderAddress: '0xAB...1234', amount: 0.8, timestamp: now - 20 * hour, txHash: '0x123...' },
      { id: 'b2', bidderAddress: '0xCD...5678', amount: 1.0, timestamp: now - 10 * hour, txHash: '0x456...' },
      { id: 'b3', bidderAddress: '0xEF...9012', amount: 1.2, timestamp: now - hour, txHash: '0x789...' },
    ]
  },
  {
    id: '2',
    title: 'Vintage 1960s Leica Camera',
    description: 'A pristine condition Leica M3 with 50mm Summicron lens. Verified provenance and original box included.',
    category: 'Collectibles',
    sellerAddress: '0x33B...11C9',
    imageUrl: 'https://picsum.photos/id/250/800/800', // Camera placeholder
    startPrice: 2.0,
    currentBid: 2.0,
    highestPayableBid: 2.0,
    bidIncrement: 0.1,
    startTime: now - 2 * day,
    endTime: now + 20 * hour,
    status: AuctionStatus.LIVE,
    isVerified: true,
    bids: []
  },
  {
    id: '3',
    title: 'Abstract Thoughts by X',
    description: 'Oil on canvas, 48x48 inches. A physical piece that comes with a digital twin NFT.',
    category: 'Art',
    sellerAddress: '0x99A...BB22',
    imageUrl: 'https://picsum.photos/id/104/800/800',
    startPrice: 5.0,
    currentBid: 8.5,
    highestPayableBid: 8.2,
    bidIncrement: 0.5,
    startTime: now - 5 * day,
    endTime: now - 2 * hour,
    status: AuctionStatus.ENDED,
    isVerified: true,
    bids: [
        { id: 'b10', bidderAddress: '0xWinner', amount: 8.5, timestamp: now - 3 * hour, txHash: '0xWin...' }
    ]
  },
  {
    id: '4',
    title: 'Decentraland Estate (Prime)',
    description: 'Large estate located near the Genesis Plaza. High traffic area suitable for commercial development.',
    category: 'Real Estate',
    sellerAddress: '0xLAND...LORD',
    imageUrl: 'https://picsum.photos/id/164/800/800',
    startPrice: 10.0,
    currentBid: 10.0,
    highestPayableBid: 10.0,
    bidIncrement: 1.0,
    startTime: now + day,
    endTime: now + 8 * day,
    status: AuctionStatus.UPCOMING,
    isVerified: true,
    bids: []
  },
  {
    id: '5',
    title: 'Limited Edition Smart Watch',
    description: 'Prototype model from major tech brand. Unreleased to public.',
    category: 'Tech',
    sellerAddress: '0xTech...Dev',
    imageUrl: 'https://picsum.photos/id/3/800/800',
    startPrice: 1.5,
    currentBid: 3.2,
    highestPayableBid: 3.1,
    bidIncrement: 0.1,
    startTime: now - 2 * hour,
    endTime: now + 2 * day,
    status: AuctionStatus.LIVE,
    isVerified: false,
    bids: [
        { id: 'b20', bidderAddress: '0xUser1', amount: 2.0, timestamp: now - hour, txHash: '0x...' },
        { id: 'b21', bidderAddress: '0xUser2', amount: 3.2, timestamp: now - 10 * 60000, txHash: '0x...' }
    ]
  }
];

// Mock Service simulation
export const AuctionService = {
  getAll: async (): Promise<Auction[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_AUCTIONS]), 600));
  },
  getById: async (id: string): Promise<Auction | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_AUCTIONS.find(a => a.id === id)), 400));
  },
  placeBid: async (auctionId: string, amount: number, bidderAddress: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Bid placed on ${auctionId} for ${amount} ETH by ${bidderAddress}`);
            resolve(true);
        }, 2000); // Simulate network delay
    });
  }
};
