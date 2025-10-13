# TreeShopTerminal Deployment Guide

## GitHub Repository

**Repo:** https://github.com/treeshoptech/treeshopterminal
**Branch:** main

## Vercel Deployment

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Import from GitHub: `treeshoptech/treeshopterminal`
3. Configure project:
   - **Project Name:** `treeshopterminal`
   - **Framework:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (will run Convex deploy)
   - **Output Directory:** `.next`

### Step 2: Environment Variables

Add these in Vercel project settings → Environment Variables:

```bash
# Convex (TreeShopTerminal production)
NEXT_PUBLIC_CONVEX_URL=https://effervescent-horse-265.convex.cloud
CONVEX_DEPLOY_KEY=prod:effervescent-horse-265|YOUR_DEPLOY_KEY_HERE
CONVEX_DEPLOYMENT=prod:effervescent-horse-265

# Google Maps (same as local)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDxWFJ_TKhVMF9ubOlkVNNzRLHvRsffecU
GOOGLE_MAPS_API_KEY=AIzaSyDxWFJ_TKhVMF9ubOlkVNNzRLHvRsffecU

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xvc2UtdG9tY2F0LTY0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_eHWVHT9n4nn106Y0GQNG4e3b64urKHSTpdFFHEKLxS

# Stripe (when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Application
NEXT_PUBLIC_BASE_URL=https://treeshopterminal.com
NODE_ENV=production
```

### Step 3: Domain Configuration

1. In Vercel project → Settings → Domains
2. Add custom domain: `treeshopterminal.com`
3. Add `www.treeshopterminal.com` (optional)
4. Vercel will provide DNS instructions

### Step 4: DNS Configuration (at your domain registrar)

Add these DNS records:

```
Type    Name    Value
A       @       76.76.21.21 (Vercel IP)
CNAME   www     cname.vercel-dns.com
```

Or if using Vercel nameservers, update at registrar:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Step 5: Deploy

Vercel auto-deploys on every push to `main`.

**Manual deploy:**
```bash
npx vercel --prod
```

## Post-Deployment Checklist

- [ ] App loads at https://treeshopterminal.com
- [ ] Mock auth working (shows "Demo Tree Service")
- [ ] Dashboard loads
- [ ] Customers page loads
- [ ] Time tracker page loads
- [ ] Neumorphism styles render correctly
- [ ] Convex queries working
- [ ] No console errors

## Production URL

**Live at:** https://treeshopterminal.com

## Next Steps After Deployment

1. **Switch to real Clerk:**
   - Get production Clerk keys
   - Add to Vercel env vars
   - Update `lib/auth/index.ts` → `USE_MOCK_AUTH = false`
   - Redeploy

2. **Add Google Maps:**
   - Verify API key works in production
   - Build map components
   - Enable required APIs in Google Cloud Console

3. **Configure Stripe:**
   - Add production Stripe keys
   - Set up products/prices
   - Test checkout flow

## Support

- **GitHub Issues:** https://github.com/treeshoptech/treeshopterminal/issues
- **Vercel Dashboard:** https://vercel.com/treeshoptech/treeshopterminal
- **Convex Dashboard:** https://dashboard.convex.dev
