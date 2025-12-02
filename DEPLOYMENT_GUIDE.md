# DecentraAuction - Deployment Guide

## 🚀 Deploy to Vercel

Follow these steps to deploy your DecentraAuction project to Vercel:

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your project pushed to GitHub

---

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
cd /Users/simarpreetsingh/Desktop/Blokchain/blockchain
git init
```

2. **Create .gitignore** (already exists, verify it includes):
```
node_modules
dist
.env
.env.local
```

3. **Commit your code**:
```bash
git add .
git commit -m "Initial commit - DecentraAuction ready for deployment"
```

4. **Create GitHub repository**:
   - Go to https://github.com/new
   - Name: `decentra-auction`
   - Make it public or private
   - Don't initialize with README (you already have code)

5. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/decentra-auction.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `decentra-auction`
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `blockchain` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your site will be live at: `https://decentra-auction.vercel.app`

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd /Users/simarpreetsingh/Desktop/Blokchain/blockchain
vercel
```

4. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name? **decentra-auction**
   - Directory? **./blockchain** or just press Enter
   - Override settings? **N**

5. **Production deployment**:
```bash
vercel --prod
```

---

## Step 3: Verify Deployment

1. **Check your deployment**:
   - Visit the URL provided by Vercel
   - Test wallet connection
   - Try creating an auction
   - Test bidding functionality

2. **Common Issues**:

   **Issue**: 404 on routes
   - **Fix**: Ensure `vercel.json` has rewrites (already added)

   **Issue**: Build fails
   - **Fix**: Check build logs, ensure all dependencies in package.json

   **Issue**: MetaMask not connecting
   - **Fix**: This is normal - users need MetaMask extension installed

---

## Step 4: Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Free Vercel Domain**:
   - You get: `your-project.vercel.app`
   - Can customize: `decentra-auction.vercel.app`

---

## Environment Variables (If Needed)

If you have any environment variables:

1. **In Vercel Dashboard**:
   - Go to "Settings" → "Environment Variables"
   - Add variables (e.g., API keys)
   - Redeploy

---

## Automatic Deployments

Once connected to GitHub:
- **Every push to `main`** → Production deployment
- **Every pull request** → Preview deployment
- **Automatic HTTPS** and CDN

---

## Post-Deployment Checklist

✅ Test all pages (Home, Explore, Create, Auction Details)
✅ Test wallet connection with MetaMask
✅ Verify smart contract address is correct
✅ Test creating an auction
✅ Test placing bids
✅ Test withdraw functionality
✅ Check mobile responsiveness
✅ Verify animations work
✅ Test on different browsers

---

## Monitoring & Analytics

1. **Vercel Analytics**:
   - Go to your project dashboard
   - Click "Analytics"
   - View traffic, performance, etc.

2. **Error Tracking**:
   - Check "Deployments" → "Functions"
   - View logs for errors

---

## Updating Your Deployment

To update your live site:

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to production
4. Update your live site

---

## Important Notes

⚠️ **Smart Contract Address**:
- Your contract is on Sepolia testnet
- Users need Sepolia ETH to interact
- Consider adding a faucet link in your UI

⚠️ **MetaMask Required**:
- Users must have MetaMask installed
- Add clear instructions on your site

⚠️ **Network Configuration**:
- Ensure users are on Sepolia network
- Your app auto-switches network (already implemented)

---

## Troubleshooting

### Build Errors

1. **Check build logs** in Vercel dashboard
2. **Test locally**:
```bash
npm run build
npm run preview
```

### Runtime Errors

1. **Check browser console**
2. **Verify contract address** in `contracts/address.ts`
3. **Check network** (should be Sepolia)

### Performance Issues

1. **Enable Vercel Speed Insights**
2. **Optimize images** (use WebP format)
3. **Code splitting** (already done with React Router)

---

## Success! 🎉

Your DecentraAuction is now live and accessible worldwide!

**Share your deployment**:
- Tweet about it
- Add to your portfolio
- Share on LinkedIn
- Add to your resume

**Next Steps**:
- Monitor analytics
- Gather user feedback
- Iterate and improve
- Consider mainnet deployment

---

## Support

If you encounter issues:
- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: Create issues in your repo

---

**Deployed by**: Vercel
**Framework**: Vite + React
**Blockchain**: Ethereum Sepolia
**Status**: ✅ Production Ready
