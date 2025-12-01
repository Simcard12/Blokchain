export enum AuctionStatus {
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export interface Bid {
  id: string;
  bidderAddress: string;
  amount: number;
  timestamp: number;
  txHash: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  category: string;
  sellerAddress: string;
  imageUrl: string;
  startPrice: number;
  currentBid: number;
  highestPayableBid: number;
  bidIncrement: number;
  startTime: number;
  endTime: number;
  status: AuctionStatus;
  bids: Bid[];
  isVerified: boolean;
}

export interface User {
  address: string;
  balance: string;
  isConnected: boolean;
}

export type Category = 'All' | 'Art' | 'Collectibles' | 'Luxury' | 'Real Estate' | 'Tech';
