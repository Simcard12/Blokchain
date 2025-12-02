# 🎯 DecentraAuction

A decentralized auction marketplace built on Ethereum blockchain with a modern, animated frontend.

![DecentraAuction](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Smart Contract](https://img.shields.io/badge/Solidity-0.8.20-orange)
![Frontend](https://img.shields.io/badge/React-19.2.0-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

- ✅ **Vickrey Auction Mechanism** - Second-price sealed-bid auctions
- ✅ **MetaMask Integration** - Seamless wallet connection
- ✅ **Real-time Bidding** - Live auction updates
- ✅ **Automatic Refunds** - Smart contract handles all payments
- ✅ **Auctioneer Controls** - Cancel or end auctions
- ✅ **Withdraw System** - Pull-based payment pattern
- ✅ **Modern UI** - 3D animations and glassmorphism
- ✅ **Responsive Design** - Works on all devices

## 🚀 Live Demo

**[View Live Demo](https://your-deployment-url.vercel.app)**

## 📸 Screenshots

### Home Page
Beautiful landing page with animated hero section and featured auctions.

### Explore Auctions
Browse all auctions with category filters and search functionality.

### Auction Details
Detailed view with live countdown, bidding interface, and auctioneer controls.

## 🛠️ Tech Stack

### Blockchain
- **Solidity 0.8.20** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **Ethereum Sepolia** - Test network

### Frontend
- **React 19.2.0** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool
- **ethers.js 6.15.0** - Blockchain interaction
- **Framer Motion** - Animations
- **TailwindCSS** - Styling

## 📋 Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/decentra-auction.git
cd decentra-auction
```

### 2. Install dependencies
```bash
# Install frontend dependencies
cd blockchain
npm install

# Install smart contract dependencies
cd ../smart_contracts
npm install
```

### 3. Configure environment
```bash
# In smart_contracts folder
cp .env.example .env
# Add your private key and Infura/Alchemy API key
```

### 4. Deploy smart contract (if needed)
```bash
cd smart_contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Update contract address
```bash
# Update blockchain/contracts/address.ts with your deployed contract address
```

### 6. Run development server
```bash
cd blockchain
npm run dev
```

Visit `http://localhost:3000`

## 📝 Smart Contract

### Deployed Contract
- **Network**: Ethereum Sepolia Testnet
- **Address**: `0x3AffC2d6e5b203c4F696947e67c33f1F99111a81`
- **[View on Etherscan](https://sepolia.etherscan.io/address/0x3AffC2d6e5b203c4F696947e67c33f1F99111a81)**

### Contract Functions

```solidity
// Create a new auction
function createAuction(
    string memory _title,
    string memory _description,
    string memory _imageHash,
    string memory _category,
    uint256 _startTime,
    uint256 _endTime,
    uint256 _minBidIncrement
) external

// Place a bid
function placeBid(uint256 _auctionId) external payable

// Withdraw refunded ETH
function withdraw() external

// End auction (after time expires)
function endAuction(uint256 _auctionId) external

// Cancel auction (auctioneer only)
function cancelAuction(uint256 _auctionId) external
```

## 🎮 How to Use

### For Bidders

1. **Connect Wallet**
   - Click "Connect Wallet" in the navbar
   - Approve MetaMask connection
   - Ensure you're on Sepolia network

2. **Browse Auctions**
   - Go to "Explore" page
   - Filter by category or search
   - Click on an auction to view details

3. **Place a Bid**
   - Enter your bid amount
   - Must be higher than current price
   - Confirm transaction in MetaMask
   - Wait for confirmation

4. **Withdraw Funds**
   - If outbid, green "Withdraw" button appears in navbar
   - Click to claim your refund
   - Confirm transaction

### For Auctioneers

1. **Create Auction**
   - Click "Create Auction"
   - Fill in details (title, description, image, etc.)
   - Set start/end times
   - Set minimum bid increment
   - Confirm transaction

2. **Manage Auction**
   - View your auction in "Explore"
   - Monitor bids in real-time
   - Cancel if needed (before end time)
   - End auction after time expires to collect payment

## 🔒 Security Features

- ✅ **ReentrancyGuard** - Prevents reentrancy attacks
- ✅ **Access Control** - Only auctioneer can cancel
- ✅ **Input Validation** - All parameters validated
- ✅ **Pull Payments** - Users withdraw their own funds
- ✅ **Checks-Effects-Interactions** - Safe state updates

## 🎨 UI Features

- 🎭 **3D Card Effects** - Perspective transforms on hover
- 🌊 **Smooth Animations** - Framer Motion integration
- 💎 **Glassmorphism** - Modern frosted glass effects
- 🌈 **Gradient Animations** - Flowing color transitions
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast Loading** - Vite for instant HMR

## 📊 Project Structure

```
Blokchain/
├── blockchain/                 # Frontend application
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   └── AuctionCard.tsx
│   ├── pages/                 # Page components
│   │   ├── Home.tsx
│   │   ├── Explore.tsx
│   │   ├── CreateAuction.tsx
│   │   └── AuctionDetails.tsx
│   ├── services/              # Web3 services
│   │   └── Web3Service.ts
│   ├── context/               # React context
│   │   └── Web3Context.tsx
│   ├── contracts/             # Contract ABI & address
│   │   ├── AuctionMarketplace.json
│   │   └── address.ts
│   └── types.ts               # TypeScript types
│
└── smart_contracts/           # Smart contract code
    ├── contracts/
    │   └── AuctionMarketplace.sol
    ├── scripts/
    │   └── deploy.js
    └── hardhat.config.ts
```

## 🧪 Testing

### Smart Contract Tests
```bash
cd smart_contracts
npx hardhat test
```

### Frontend Tests
```bash
cd blockchain
npm run test
```

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `blockchain`
4. Deploy!

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for development tools
- Vite for blazing fast builds
- Framer Motion for smooth animations
- The Ethereum community

## 📞 Support

For support, email your@email.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] IPFS integration for decentralized image storage
- [ ] NFT support (ERC-721)
- [ ] Multi-currency support (USDC, DAI)
- [ ] Auction templates
- [ ] User profiles and reputation
- [ ] Mobile app
- [ ] Mainnet deployment

---

**Built with ❤️ using Blockchain Technology**

⭐ Star this repo if you find it helpful!
