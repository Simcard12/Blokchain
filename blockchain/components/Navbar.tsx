import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { Web3Service } from '../services/Web3Service';
import { Gavel, Menu, X, Wallet, User as UserIcon, Sparkles, ArrowDownToLine } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { account, connectWallet, isConnecting, formatAddress, balance, contract } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingReturns, setPendingReturns] = useState<string>('0');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Fetch pending returns when account changes
  useEffect(() => {
    const fetchPendingReturns = async () => {
      if (account) {
        const returns = await Web3Service.getPendingReturns(account);
        setPendingReturns(returns);
      }
    };
    fetchPendingReturns();

    // Poll every 10 seconds
    const interval = setInterval(fetchPendingReturns, 10000);
    return () => clearInterval(interval);
  }, [account]);

  const handleWithdraw = async () => {
    if (!contract || !account) return;

    setIsWithdrawing(true);
    try {
      const tx = await contract.withdraw();
      await tx.wait();

      // Refresh pending returns
      const returns = await Web3Service.getPendingReturns(account);
      setPendingReturns(returns);

      alert('Withdrawal successful!');
    } catch (error: any) {
      console.error('Withdraw error:', error);
      alert(`Withdrawal failed: ${error.reason || error.message || 'Unknown error'}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 w-full bg-navy-900/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo with animation */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                className="bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-xl shadow-lg shadow-gold-500/30"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Gavel className="h-5 w-5 text-navy-900" />
              </motion.div>
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                Decentra<span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Auction</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Menu with underline animation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {[
                { path: '/', label: 'Home' },
                { path: '/explore', label: 'Explore' },
                { path: '/create', label: 'Create' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors group"
                >
                  <span className={`${isActive(item.path) ? 'text-gold-400' : 'text-gray-300 group-hover:text-white'} transition-colors relative z-10`}>
                    {item.label}
                  </span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </div>
          </div>

          {/* Wallet Connection with 3D effect */}
          <div className="hidden md:flex items-center gap-3">
            {account ? (
              <>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center space-x-4 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400 font-medium">Balance</span>
                    <motion.span
                      className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      {parseFloat(balance).toFixed(4)} ETH
                    </motion.span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="h-9 w-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/30"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <UserIcon className="h-4 w-4 text-navy-900" />
                    </motion.div>
                    <span className="text-sm font-semibold">{formatAddress(account)}</span>
                  </div>
                </motion.div>

                {/* Withdraw Button - only show if there are pending returns */}
                {parseFloat(pendingReturns) > 0 && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="relative flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 px-5 rounded-full transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Withdraw ${parseFloat(pendingReturns).toFixed(4)} ETH`}
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    <span>{isWithdrawing ? 'Withdrawing...' : `${parseFloat(pendingReturns).toFixed(3)} ETH`}</span>
                  </motion.button>
                )}
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                disabled={isConnecting}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-900 font-bold py-2.5 px-6 rounded-full transition-all shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 overflow-hidden group"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="shimmer absolute inset-0" />
                </div>
                <Wallet className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                {!isConnecting && <Sparkles className="h-4 w-4 relative z-10" />}
              </motion.button>
            )}
          </div>

          {/* Mobile menu button with animation */}
          <motion.div
            className="-mr-2 flex md:hidden"
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu with slide animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-navy-800/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
            >
              {[
                { path: '/', label: 'Home' },
                { path: '/explore', label: 'Explore' },
                { path: '/create', label: 'Create Auction' }
              ].map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive(item.path)
                      ? 'text-gold-400 bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                {account ? (
                  <div className="px-4 py-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 font-medium">Connected as</p>
                    <p className="font-bold text-gold-400 mt-1">{formatAddress(account)}</p>
                    <p className="text-sm mt-2 text-white">{parseFloat(balance).toFixed(4)} ETH</p>
                  </div>
                ) : (
                  <button
                    onClick={() => { connectWallet(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 rounded-lg text-base font-bold bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 hover:from-gold-500 hover:to-gold-700 transition-all shadow-lg"
                  >
                    Connect Wallet
                  </button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
