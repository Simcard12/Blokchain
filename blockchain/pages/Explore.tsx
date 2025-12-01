import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Web3Service } from '../services/Web3Service';
import { Auction, Category } from '../types';
import { AuctionCard } from '../components/AuctionCard';
import { Search, Filter, X, Sparkles } from 'lucide-react';

export const Explore: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories: Category[] = ['All', 'Art', 'Collectibles', 'Luxury', 'Real Estate', 'Tech'];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await Web3Service.getAllAuctions();
      setAuctions(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredAuctions = auctions.filter(auction => {
    const matchesCategory = selectedCategory === 'All' || auction.category === selectedCategory;
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <motion.h1
                className="text-5xl font-serif font-bold text-navy-900 mb-2"
                whileHover={{ scale: 1.02 }}
              >
                Explore Auctions
              </motion.h1>
              <p className="text-gray-500 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-500" />
                Discover unique items from around the world
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search with animation */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                )}
              </motion.div>

              {/* Filter Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gold-400 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              >
                <Filter className="h-5 w-5 mr-2" />
                <span>Filters</span>
              </motion.button>
            </div>
          </div>

          {/* Categories with scroll animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex overflow-x-auto pb-4 scrollbar-hide space-x-3"
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-gradient-to-r from-navy-900 to-navy-800 text-white shadow-lg shadow-navy-900/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-gold-400'
                  }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <motion.span
                    layoutId="categoryIndicator"
                    className="ml-2 inline-block w-2 h-2 bg-gold-400 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-gray-600 font-medium"
        >
          {!loading && (
            <span>
              Showing <span className="text-navy-900 font-bold">{filteredAuctions.length}</span> {filteredAuctions.length === 1 ? 'auction' : 'auctions'}
            </span>
          )}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl h-96 shadow-lg overflow-hidden"
              >
                <div className="animate-pulse">
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredAuctions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="inline-block mb-4"
                >
                  <Search className="w-16 h-16 text-gray-300" />
                </motion.div>
                <p className="text-gray-500 text-xl mb-2 font-medium">No auctions found</p>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-white font-bold rounded-full hover:from-gold-500 hover:to-gold-700 transition-all duration-300 shadow-lg shadow-gold-500/30"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key={selectedCategory + searchQuery}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredAuctions.map((auction, index) => (
                  <motion.div
                    key={auction.id}
                    variants={itemVariants}
                    custom={index}
                    layout
                  >
                    <AuctionCard auction={auction} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
