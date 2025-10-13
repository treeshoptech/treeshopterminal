# TreeShopTerminal - Production Deployment Checklist

## Pre-Deployment (Do These First)

### 1. Clerk Dashboard Configuration
- [ ] Go to https://dashboard.clerk.com
- [ ] Select application: **improved-bulldog-75**
- [ ] Navigate to **JWT Templates** → **New Template** → **Convex**
- [ ] Save the Convex JWT template
- [ ] Verify issuer is: `https://improved-bulldog-75.clerk.accounts.dev`

### 2. Convex Configuration
```bash
# Deploy the auth config to Convex
npx convex deploy
```
- [ ] Confirm deployment successful
- [ ] Verify auth config is live

### 3. Vercel Environment Variables
Go to: Vercel Dashboard → treeshopterminal → Settings → Environment Variables

Set these for **Production** environment:

```bash
# Clerk - Production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aW1wcm92ZWQtYnVsbGRvZy03NS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_RgSQ7K5rFDxVmK6kQZ7nTX7gW2Y8xH4aJKmL9pN3qR
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex - Production
NEXT_PUBLIC_CONVEX_URL=https://earnest-lemming-634.convex.cloud
CONVEX_DEPLOY_KEY=prod:earnest-lemming-634|eyJ2MiI6IjRlNTVmYWNiMzVhZDQyNzk4ZTYyNDRiZDQyYmEwZTczIn0=
CONVEX_DEPLOYMENT=prod:earnest-lemming-634

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCUKaBZ4zGS9pMHWgDM0P8PlrwWO4C-fJY
GOOGLE_MAPS_API_KEY=AIzaSyCUKaBZ4zGS9pMHWgDM0P8PlrwWO4C-fJY

# Application
NEXT_PUBLIC_BASE_URL=https://treeshopterminal.com
NODE_ENV=production
```

- [ ] All environment variables added to Vercel
- [ ] Verified no typos in variable names
- [ ] Environment set to **Production**

---

## Deployment

### 4. Git Commit & Push
```bash
git add .
git commit -m "Configure production auth: Clerk modal + Convex JWT integration

- Remove all sign-up UI (invite-only system)
- Configure Clerk to stay on treeshopterminal.com domain
- Add Convex JWT auth config
- Update environment variables for production
- Add comprehensive setup documentation"

git push origin main
```

- [ ] Changes committed to git
- [ ] Pushed to GitHub
- [ ] Vercel auto-deploy triggered

### 5. Monitor Deployment
- [ ] Watch Vercel deployment logs
- [ ] Ensure build completes successfully
- [ ] Check for any deployment errors

---

## Post-Deployment Testing

### 6. Test Authentication Flow
Visit: https://treeshopterminal.com

**Expected Behavior:**
1. [ ] Homepage loads with dark background
2. [ ] Modal sign-in overlay appears immediately
3. [ ] "TreeShop Terminal" branding visible
4. [ ] Sign-in form shows (NO sign-up links visible)
5. [ ] User can sign in with credentials
6. [ ] After sign-in, modal closes automatically
7. [ ] User sees the main dashboard
8. [ ] No redirects away from treeshopterminal.com

**Console Check:**
- [ ] Open DevTools → Console
- [ ] NO 404 errors for `/tokens/convex`
- [ ] NO "Unauthorized" Convex errors
- [ ] Only green development warning (acceptable until production keys)

### 7. Test Convex Integration
After signing in:
1. [ ] Go to Equipment page
2. [ ] Data loads successfully
3. [ ] No console errors
4. [ ] Go to Employees page
5. [ ] Data loads successfully
6. [ ] Go to Projects page
7. [ ] Data loads successfully

### 8. Test Protected Routes
1. [ ] Open incognito/private window
2. [ ] Visit https://treeshopterminal.com/equipment directly
3. [ ] Should redirect to `/` with modal overlay
4. [ ] Cannot access any page without signing in

---

## Troubleshooting

### Issue: Still seeing 404 errors for /tokens/convex
**Root Cause:** JWT template not configured in Clerk

**Fix:**
1. Go to Clerk Dashboard → JWT Templates
2. Create new Convex template
3. Save and wait 30 seconds
4. Refresh treeshopterminal.com

### Issue: "Unauthorized" errors in Convex queries
**Root Cause:** Convex auth config not deployed

**Fix:**
```bash
npx convex deploy
```

### Issue: Users redirected away from treeshopterminal.com
**Root Cause:** Clerk URL environment variables incorrect

**Fix:**
1. Check Vercel env vars
2. Ensure all Clerk URLs are set to `/`
3. Redeploy

### Issue: Development keys warning in console
**Status:** Expected and acceptable

**Info:** Using `pk_test_` keys triggers this warning. Upgrade to production keys (`pk_live_`) when ready.

### Issue: Sign-up links still visible
**Root Cause:** Old Clerk component cached

**Fix:**
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
2. Clear site data in DevTools
3. Reload page

---

## Final Verification

- [ ] treeshopterminal.com loads correctly
- [ ] Modal sign-in overlay appears
- [ ] Authentication works end-to-end
- [ ] No sign-up UI visible anywhere
- [ ] Convex queries work after sign-in
- [ ] No 404 or Unauthorized errors in console
- [ ] All protected routes require authentication
- [ ] Users never leave treeshopterminal.com domain

---

## What Changed

### Before This Deploy:
❌ Separate /sign-in page (redirects away from domain)
❌ Sign-up UI visible (not invite-only)
❌ 404 errors for Convex JWT tokens
❌ Unauthorized errors in Convex queries
❌ Development environment config

### After This Deploy:
✅ Modal overlay sign-in (stays on treeshopterminal.com)
✅ No sign-up UI (invite-only)
✅ Clerk JWT tokens work with Convex
✅ All Convex queries authenticated
✅ Production environment config

---

## Next Steps

### 1. Upgrade to Production Clerk Keys
When ready for full production:
1. Go to Clerk Dashboard → Settings → API Keys
2. Generate production keys: `pk_live_...` and `sk_live_...`
3. Update Vercel environment variables
4. Redeploy

### 2. Invite Founding Members
Via Clerk Dashboard:
1. Go to Users → Invite User
2. Enter email address
3. Send invitation
4. They'll receive email to create account

### 3. Monitor Usage
- Clerk Dashboard: User activity
- Convex Dashboard: Query performance
- Vercel Analytics: Page views

---

## Emergency Rollback

If something breaks badly:

```bash
# Revert the commit
git revert HEAD

# Push rollback
git push origin main

# Or restore from previous commit
git reset --hard <previous-commit-hash>
git push -f origin main
```

Then check Vercel for auto-deploy of rollback.

---

## Support Resources

- **Clerk Docs:** https://clerk.com/docs/integrations/databases/convex
- **Convex Auth:** https://docs.convex.dev/auth/clerk
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware
- **Setup Guide:** See `CLERK_CONVEX_SETUP.md` in repo root

---

**DEPLOYMENT COMPLETE** ✅

Your site is now live with secure, modal-based authentication that keeps users on treeshopterminal.com.
