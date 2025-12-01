import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Category } from '../types';
import { Upload, DollarSign, Calendar } from 'lucide-react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

export const CreateAuction: React.FC = () => {
    const { account, connectWallet, contract } = useWeb3();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Art' as Category,
        startPrice: '',
        startTime: '',
        endTime: '',
        imageUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract) {
            alert("Smart contract not initialized. Please ensure your wallet is connected.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert dates to Unix timestamps (seconds)
            const startTimestamp = Math.floor(new Date(formData.startTime).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000);

            // Convert price to Wei
            const minBidIncrement = ethers.parseEther(formData.startPrice);

            // Call smart contract
            const tx = await contract.createAuction(
                formData.title,
                formData.description,
                formData.imageUrl,
                formData.category,
                startTimestamp,
                endTimestamp,
                minBidIncrement
            );

            console.log("Transaction sent:", tx.hash);

            // Wait for transaction to be mined
            await tx.wait();

            alert('Auction created successfully!');
            navigate('/explore');

        } catch (error: any) {
            console.error("Error creating auction:", error);
            alert(`Failed to create auction: ${error.reason || error.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!account) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Connect Wallet to Create</h2>
                    <p className="text-gray-500 mb-6">You need to connect your Ethereum wallet to list items on the decentralized marketplace.</p>
                    <button
                        onClick={connectWallet}
                        className="w-full bg-gold-500 text-navy-900 font-bold py-3 rounded-lg hover:bg-gold-600 transition-colors"
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">Create New Auction</h1>
                <p className="text-gray-500 mb-8">List your digital or physical asset on the Sepolia blockchain.</p>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                                placeholder="e.g. Cosmic Cube #001"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                                placeholder="Describe the item, condition, and provenance..."
                            />
                        </div>

                        {/* Category & Image URL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                                >
                                    <option value="Art">Art</option>
                                    <option value="Collectibles">Collectibles</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Tech">Tech</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        required
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                                    />
                                    <Upload className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (ETH)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.001"
                                    name="startPrice"
                                    required
                                    value={formData.startPrice}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                                    placeholder="0.1"
                                />
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Timing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        required
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        required
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                            <p><strong>Note:</strong> Creating an auction invokes a smart contract transaction on Ethereum Sepolia. Gas fees apply.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 bg-navy-900 text-white font-bold rounded-lg shadow hover:bg-navy-800 transition-colors ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? 'Minting & Listing...' : 'List Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
