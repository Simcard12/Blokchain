#!/bin/bash

# DecentraAuction - Quick Deployment Script
# This script helps you deploy to Vercel

echo "🚀 DecentraAuction Deployment Helper"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the blockchain directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "❌ Error: .gitignore not found"
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "1. ✅ Smart contract deployed to Sepolia"
echo "2. ✅ Contract address updated in contracts/address.ts"
echo "3. ✅ Build successful"
echo "4. ✅ All features tested locally"
echo ""

# Test build
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com/new"
echo "   - Name: decentra-auction"
echo "   - Don't initialize with README"
echo ""
echo "2. Push your code:"
echo "   git add ."
echo "   git commit -m \"Initial commit - Ready for deployment\""
echo "   git remote add origin https://github.com/YOUR_USERNAME/decentra-auction.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Click 'Import Project'"
echo "   - Select your GitHub repo"
echo "   - Set root directory to: blockchain"
echo "   - Click 'Deploy'"
echo ""
echo "🎉 Your site will be live in 2-3 minutes!"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
