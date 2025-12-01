import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Web3Service } from '../services/Web3Service';
import { Auction, AuctionStatus, Bid } from '../types';
import { useWeb3 } from '../context/Web3Context';
import { Clock, ShieldCheck, User, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';

export const AuctionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { account, connectWallet, balance, contract } = useWeb3();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [placingBid, setPlacingBid] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Refresh interval for live timer
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (id) {
            Web3Service.getAuctionById(id).then(setAuction);
        }
    }, [id]);

    useEffect(() => {
        if (!auction) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const endTimeMs = auction.endTime * 1000; // Convert seconds to milliseconds
            const startTimeMs = auction.startTime * 1000;

            // Check if auction hasn't started yet
            if (now < startTimeMs) {
                const diff = startTimeMs - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                const diff = endTimeMs - now;

                if (diff <= 0) {
                    setTimeLeft('Ended');
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [auction]);

    const handlePlaceBid = async () => {
        setMessage(null);
        if (!account) return connectWallet();
        if (!auction) return;

        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= auction.currentBid) {
            setMessage({ type: 'error', text: 'Bid must be higher than current highest bid.' });
            return;
        }

        const minBid = auction.currentBid + auction.bidIncrement;
        if (amount < minBid) {
            setMessage({ type: 'error', text: `Minimum bid increment is ${auction.bidIncrement} ETH. Min bid: ${minBid.toFixed(4)}` });
            return;
        }

        if (parseFloat(balance) < amount) {
            setMessage({ type: 'error', text: 'Insufficient ETH balance.' });
            return;
        }

        setPlacingBid(true);
        try {
            // Get contract from Web3Context
            if (!contract) {
                setMessage({ type: 'error', text: 'Contract not initialized.' });
                return;
            }

            // Place bid on smart contract
            const tx = await contract.placeBid(auction.id, {
                value: ethers.parseEther(amount.toString())
            });

            await tx.wait();

            // Refresh auction data
            const updatedAuction = await Web3Service.getAuctionById(auction.id);
            if (updatedAuction) {
                setAuction(updatedAuction);
            }

            setMessage({ type: 'success', text: 'Bid placed successfully!' });
            setBidAmount('');
        } catch (err: any) {
            console.error('Bid error:', err);
            setMessage({ type: 'error', text: err.reason || err.message || 'Transaction failed.' });
        } finally {
            setPlacingBid(false);
        }
    };

    const handleCancelAuction = async () => {
        if (!contract || !auction) return;

        if (!window.confirm('Are you sure you want to cancel this auction? This action cannot be undone.')) {
            return;
        }

        setIsCanceling(true);
        try {
            const tx = await contract.cancelAuction(auction.id);
            await tx.wait();

            // Refresh auction data
            const updatedAuction = await Web3Service.getAuctionById(auction.id);
            if (updatedAuction) {
                setAuction(updatedAuction);
            }

            setMessage({ type: 'success', text: 'Auction cancelled successfully!' });
        } catch (err: any) {
            console.error('Cancel error:', err);
            setMessage({ type: 'error', text: err.reason || err.message || 'Failed to cancel auction.' });
        } finally {
            setIsCanceling(false);
        }
    };

    const handleEndAuction = async () => {
        if (!contract || !auction) return;

        setIsEnding(true);
        try {
            const tx = await contract.endAuction(auction.id);
            await tx.wait();

            // Refresh auction data
            const updatedAuction = await Web3Service.getAuctionById(auction.id);
            if (updatedAuction) {
                setAuction(updatedAuction);
            }

            setMessage({ type: 'success', text: 'Auction ended successfully! Payment sent to auctioneer.' });
        } catch (err: any) {
            console.error('End auction error:', err);
            setMessage({ type: 'error', text: err.reason || err.message || 'Failed to end auction.' });
        } finally {
            setIsEnding(false);
        }
    };

    if (!auction) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div></div>;

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <Link to="/explore" className="inline-flex items-center text-gray-500 hover:text-navy-900 mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Explore
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100 relative group">
                            <img src={auction.imageUrl} alt={auction.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
                            <ShieldCheck className="h-6 w-6 text-blue-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Blockchain Verified</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    This asset's authenticity is secured on the Ethereum Sepolia network. Contract address: <span className="font-mono bg-blue-100 px-1 rounded">0xContract...123</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info & Bidding */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{auction.category}</span>
                            {auction.status === AuctionStatus.LIVE && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold uppercase flex items-center"><span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1 animate-pulse"></span> Live</span>}
                        </div>

                        <h1 className="text-4xl font-serif font-bold text-navy-900 mb-4 leading-tight">{auction.title}</h1>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Seller: <span className="text-gold-600 font-medium ml-1 cursor-pointer hover:underline">{auction.sellerAddress.substring(0, 6)}...{auction.sellerAddress.slice(-4)}</span>
                            </div>
                            <div className="flex items-center">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                <a href="#" className="hover:text-navy-900 transition-colors">View on Etherscan</a>
                            </div>
                        </div>

                        {/* Bidding Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg mb-8">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Current Highest Bid</p>
                                    <p className="text-4xl font-bold text-navy-900">{auction.currentBid} ETH</p>
                                    <p className="text-xs text-gray-400 mt-1">Highest Payable Bid Logic Active</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1 flex items-center justify-end"><Clock className="h-4 w-4 mr-1" /> Time Remaining</p>
                                    <p className="text-2xl font-mono font-bold text-gold-600">{timeLeft}</p>
                                </div>
                            </div>

                            {auction.status === AuctionStatus.LIVE ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Place a bid</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                placeholder={`Min bid: ${(auction.currentBid + auction.bidIncrement).toFixed(2)}`}
                                                className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 font-bold sm:text-sm">ETH</span>
                                            </div>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-lg flex items-start text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePlaceBid}
                                        disabled={placingBid}
                                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 ${placingBid
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-navy-900 text-white hover:bg-navy-800 hover:shadow-xl'
                                            }`}
                                    >
                                        {placingBid ? 'Confirming on Chain...' : 'Place Bid'}
                                    </button>
                                    <p className="text-center text-xs text-gray-400">
                                        Minimum increment: {auction.bidIncrement} ETH. Funds held in smart contract until auction ends.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <p className="font-bold text-gray-600">This auction has ended.</p>
                                    {auction.status === AuctionStatus.ENDED && auction.currentBid > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500">Winner:</p>
                                            <p className="font-bold text-gold-600">Highest Bidder</p>
                                            <p className="text-lg font-bold text-navy-900 mt-2">{auction.highestPayableBid} ETH</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Auctioneer Controls */}
                        {account && auction.sellerAddress.toLowerCase() === account.toLowerCase() && (
                            <div className="mt-6 space-y-3">
                                {/* Cancel Button - only show if auction is active and not ended */}
                                {auction.status !== AuctionStatus.ENDED && auction.status !== AuctionStatus.CANCELLED && (
                                    <button
                                        onClick={handleCancelAuction}
                                        disabled={isCanceling}
                                        className="w-full py-3 px-6 rounded-lg font-bold text-base bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCanceling ? 'Canceling...' : '🚫 Cancel Auction'}
                                    </button>
                                )}

                                {/* End Auction Button - only show if auction time has passed and not ended */}
                                {auction.status !== AuctionStatus.ENDED &&
                                    auction.status !== AuctionStatus.CANCELLED &&
                                    Date.now() > auction.endTime * 1000 && (
                                        <button
                                            onClick={handleEndAuction}
                                            disabled={isEnding}
                                            className="w-full py-3 px-6 rounded-lg font-bold text-base bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isEnding ? 'Ending...' : '✅ End Auction & Collect Payment'}
                                        </button>
                                    )}

                                {auction.status === AuctionStatus.CANCELLED && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                                        <p className="font-bold text-red-800">This auction has been cancelled</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description & History Tabs */}
                        <div>
                            <h3 className="text-xl font-bold text-navy-900 mb-4">Description</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {auction.description}
                            </p>

                            <h3 className="text-xl font-bold text-navy-900 mb-4">Bid History</h3>
                            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                {auction.bids.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500">No bids yet. Be the first!</div>
                                ) : (
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidder</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {auction.bids.map((bid) => (
                                                <tr key={bid.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                                                        {bid.bidderAddress.substring(0, 6)}...{bid.bidderAddress.slice(-4)}
                                                        {bid.bidderAddress === account && <span className="ml-2 text-xs bg-gold-100 text-gold-800 px-1.5 py-0.5 rounded">You</span>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{bid.amount} ETH</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                        {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
