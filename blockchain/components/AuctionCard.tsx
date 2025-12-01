import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Auction, AuctionStatus } from '../types';
import { Clock, ShieldCheck, TrendingUp } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const isEnded = auction.status === AuctionStatus.ENDED;
  const isLive = auction.status === AuctionStatus.LIVE;

  // Calculate time remaining (simplified for display)
  // Note: auction.endTime is in seconds (Unix timestamp), need to convert to milliseconds
  const getTimeRemaining = () => {
    const now = Date.now();
    const endTimeMs = auction.endTime * 1000; // Convert seconds to milliseconds
    const startTimeMs = auction.startTime * 1000;

    // Check if auction hasn't started yet
    if (now < startTimeMs) {
      const diff = startTimeMs - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      if (days > 0) return `Starts in ${days}d ${hours % 24}h`;
      return `Starts in ${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`;
    }

    // Check if auction has ended
    if (now > endTimeMs) return 'Ended';

    // Calculate time remaining
    const diff = endTimeMs - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h left`;
    return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m left`;
  };

  return (
    <Link to={`/auction/${auction.id}`} className="group block">
      <motion.div
        whileHover={{
          y: -12,
          rotateX: 2,
          rotateY: -2,
          transition: { duration: 0.3, type: "spring", stiffness: 300 }
        }}
        className="perspective-container"
      >
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:border-gold-400/50 card-3d">
          {/* Image Container with 3D effect */}
          <div className="relative h-64 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.img
              src={auction.imageUrl}
              alt={auction.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Status Badge with glow */}
            <div className="absolute top-4 right-4 z-20">
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: isLive ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 2, repeat: isLive ? Infinity : 0 }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${isLive
                    ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/50'
                    : isEnded
                      ? 'bg-gray-800/90 text-white'
                      : 'bg-gold-500/90 text-navy-900 shadow-lg shadow-gold-500/50'
                  }`}
              >
                {isLive && <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />}
                {auction.status}
              </motion.span>
            </div>

            {/* Verified Badge with 3D effect */}
            {auction.isVerified && (
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className="absolute top-4 left-4 z-20 bg-blue-500 text-white p-2 rounded-full shadow-lg shadow-blue-500/50"
                title="Verified Asset"
              >
                <ShieldCheck className="w-5 h-5" />
              </motion.div>
            )}

            {/* Trending indicator */}
            {isLive && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg"
              >
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-gray-900">Trending</span>
              </motion.div>
            )}
          </div>

          {/* Content with glass effect */}
          <div className="p-6 relative">
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="shimmer absolute inset-0" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    {auction.category}
                  </p>
                  <h3 className="text-lg font-serif font-bold text-navy-900 truncate pr-2 group-hover:text-gold-600 transition-colors duration-300">
                    {auction.title}
                  </h3>
                </div>
              </div>

              {/* Divider with gradient */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Current Bid</p>
                  <motion.p
                    whileHover={{ scale: 1.05 }}
                    className="text-xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors duration-300"
                  >
                    {auction.currentBid} <span className="text-sm">ETH</span>
                  </motion.p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1 flex items-center justify-end gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {isEnded ? 'Closed' : 'Ends In'}
                  </p>
                  <p className={`text-sm font-bold ${isLive ? 'text-red-600' : 'text-gold-600'}`}>
                    {getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>

            {/* Glow effect on bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
