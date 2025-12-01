// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuctionMarketplace is ReentrancyGuard, Ownable {
    struct Auction {
        uint256 id;
        address payable auctioneer;
        string title;
        string description;
        string imageHash; // IPFS hash or URL
        string category;
        uint256 startTime;
        uint256 endTime;
        uint256 minBidIncrement;
        bool active;
        bool ended;
        bool cancelled;
        
        address payable highestBidder;
        uint256 highestBid; // The max bid placed by the highest bidder
        uint256 highestPayableBid; // The current price (second highest + increment)
    }

    uint256 public auctionIdCounter;
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingReturns;
    
    // Events
    event AuctionCreated(uint256 indexed auctionId, address indexed auctioneer, string title, uint256 startTime, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount, uint256 highestPayableBid);
    event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 amount);
    event AuctionCancelled(uint256 indexed auctionId);
    event Withdrawal(address indexed bidder, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function createAuction(
        string memory _title,
        string memory _description,
        string memory _imageHash,
        string memory _category,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _minBidIncrement
    ) external {
        require(_startTime >= block.timestamp, "Start time must be in future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_minBidIncrement > 0, "Bid increment must be > 0");

        auctionIdCounter++;
        uint256 newId = auctionIdCounter;

        auctions[newId] = Auction({
            id: newId,
            auctioneer: payable(msg.sender),
            title: _title,
            description: _description,
            imageHash: _imageHash,
            category: _category,
            startTime: _startTime,
            endTime: _endTime,
            minBidIncrement: _minBidIncrement,
            active: true,
            ended: false,
            cancelled: false,
            highestBidder: payable(address(0)),
            highestBid: 0,
            highestPayableBid: 0
        });

        emit AuctionCreated(newId, msg.sender, _title, _startTime, _endTime);
    }

    function placeBid(uint256 _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];
        
        require(auction.active, "Auction not active");
        require(!auction.ended, "Auction ended");
        require(!auction.cancelled, "Auction cancelled");
        require(block.timestamp >= auction.startTime, "Auction not started");
        require(block.timestamp < auction.endTime, "Auction expired");
        require(msg.sender != auction.auctioneer, "Auctioneer cannot bid");

        uint256 bidAmount = msg.value;
        
        // If first bid
        if (auction.highestBidder == address(0)) {
            require(bidAmount >= auction.minBidIncrement, "Bid too low");
            auction.highestBidder = payable(msg.sender);
            auction.highestBid = bidAmount;
            // HPB is min increment or bid amount if lower (though require above prevents lower)
            auction.highestPayableBid = auction.minBidIncrement; 
            if (bidAmount < auction.minBidIncrement) {
                 // Should not happen due to require, but for safety logic
                 auction.highestPayableBid = bidAmount;
            }
        } else {
            require(bidAmount > auction.highestPayableBid, "Bid too low (below current price)");
            
            if (bidAmount > auction.highestBid) {
                // New leader
                // Refund previous leader
                pendingReturns[auction.highestBidder] += auction.highestBid;
                
                uint256 secondHighest = auction.highestBid;
                auction.highestBidder = payable(msg.sender);
                auction.highestBid = bidAmount;
                
                // HPB = min(newMax, oldMax + increment)
                uint256 newHPB = secondHighest + auction.minBidIncrement;
                if (newHPB > bidAmount) {
                    newHPB = bidAmount;
                }
                auction.highestPayableBid = newHPB;
            } else if (bidAmount > auction.highestPayableBid) {
                // Challenger
                // Refund this bidder immediately
                pendingReturns[msg.sender] += bidAmount;
                
                // HPB = min(currentMax, challengerBid + increment)
                uint256 newHPB = bidAmount + auction.minBidIncrement;
                if (newHPB > auction.highestBid) {
                    newHPB = auction.highestBid;
                }
                auction.highestPayableBid = newHPB;
            } else {
                revert("Bid too low");
            }
        }

        emit BidPlaced(_auctionId, msg.sender, bidAmount, auction.highestPayableBid);
    }

    function withdraw() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
            (bool sent, ) = payable(msg.sender).call{value: amount}("");
            require(sent, "Failed to send Ether");
            emit Withdrawal(msg.sender, amount);
        }
    }

    function endAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(auction.active, "Auction not active");
        require(!auction.ended, "Auction already ended");
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        
        auction.ended = true;
        auction.active = false;

        if (auction.highestBidder != address(0)) {
            // Payout to auctioneer
            uint256 payout = auction.highestPayableBid;
            uint256 refund = auction.highestBid - payout;

            if (refund > 0) {
                pendingReturns[auction.highestBidder] += refund;
            }

            (bool sent, ) = auction.auctioneer.call{value: payout}("");
            require(sent, "Failed to send Ether to auctioneer");
        }

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestPayableBid);
    }

    function cancelAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(auction.auctioneer == msg.sender, "Only auctioneer can cancel");
        require(auction.active, "Auction not active");
        require(!auction.ended, "Auction ended");
        
        auction.cancelled = true;
        auction.active = false;

        if (auction.highestBidder != address(0)) {
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }

        emit AuctionCancelled(_auctionId);
    }
    
    function getAuctions(uint256 offset, uint256 limit) external view returns (Auction[] memory) {
        uint256 total = auctionIdCounter;
        if (offset >= total) {
            return new Auction[](0);
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        uint256 resultSize = end - offset;
        Auction[] memory result = new Auction[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = auctions[offset + i + 1];
        }
        return result;
    }
    
    function getAuction(uint256 _auctionId) external view returns (Auction memory) {
        return auctions[_auctionId];
    }
}
