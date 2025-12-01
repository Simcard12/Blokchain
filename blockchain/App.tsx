import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { AuctionDetails } from './pages/AuctionDetails';
import { CreateAuction } from './pages/CreateAuction';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const Footer = () => (
    <footer className="bg-navy-900 text-white py-12 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-2xl font-serif font-bold mb-4">Decentra<span className="text-gold-500">Auction</span></h3>
                    <p className="text-gray-400 max-w-sm">
                        The trusted decentralized marketplace for premium assets. Secure, transparent, and immutable auctions powered by Ethereum.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Marketplace</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-gold-500 transition-colors">All NFTs</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Art</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Collectibles</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Real Estate</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Resources</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Partners</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Docs</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Newsletter</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row justify-between text-gray-500 text-sm">
                <p>&copy; 2024 DecentraAuction. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white">Privacy Policy</a>
                    <a href="#" className="hover:text-white">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/auction/:id" element={<AuctionDetails />} />
              <Route path="/create" element={<CreateAuction />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;
