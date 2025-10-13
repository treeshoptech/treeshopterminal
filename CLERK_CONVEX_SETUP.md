# Clerk + Convex JWT Configuration Guide

## CRITICAL: This must be done to fix the 404 errors

The console errors you're seeing:
```
close-tomcat-64.clerk.accounts.dev/v1/client/sessions/.../tokens/convex: 404
```

These happen because **Clerk doesn't know how to create Convex-compatible JWT tokens** yet.

---

## Step 1: Create Clerk JWT Template for Convex

### Go to Clerk Dashboard:
1. Visit: https://dashboard.clerk.com
2. Select your application: **improved-bulldog-75**
3. Go to: **JWT Templates** (in left sidebar)
4. Click: **+ New Template**
5. Select: **Convex** (from the template list)

### Configure the Template:
```
Name: convex
Token Lifetime: 60 seconds (default)
```

### Claims Configuration:
Clerk will auto-populate these claims for Convex:
```json
{
  "aud": "convex",
  "sub": "{{user.id}}",
  "iss": "https://improved-bulldog-75.clerk.accounts.dev",
  "email": "{{user.primary_email_address}}",
  "email_verified": "{{user.primary_email_address_verified}}",
  "org_id": "{{user.organization_id}}",
  "org_role": "{{user.organization_role}}"
}
```

**Important:** The issuer (`iss`) MUST match your Clerk domain exactly.

6. Click **Save**

---

## Step 2: Configure Convex to Accept Clerk Tokens

### Update your Convex auth config:

Create or update `convex/auth.config.js`:

```javascript
export default {
  providers: [
    {
      domain: "https://improved-bulldog-75.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
```

### Deploy the auth config:
```bash
npx convex deploy
```

---

## Step 3: Verify Environment Variables

Ensure these are set in **both** `.env.local` AND Vercel:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/

# Convex
NEXT_PUBLIC_CONVEX_URL=https://earnest-lemming-634.convex.cloud
CONVEX_DEPLOY_KEY=prod:earnest-lemming-634|...
CONVEX_DEPLOYMENT=prod:earnest-lemming-634

# App
NEXT_PUBLIC_BASE_URL=https://treeshopterminal.com
NODE_ENV=production
```

---

## Step 4: Update Vercel Environment Variables

Go to: https://vercel.com → Your Project → Settings → Environment Variables

Add/Update ALL variables from `.env.local` to match.

**IMPORTANT:** After updating Vercel env vars, redeploy your app.

---

## Step 5: Test the Authentication Flow

### Local Testing:
```bash
npm run dev
```

1. Visit http://localhost:3002
2. You should see the modal sign-in overlay
3. Sign in with test credentials
4. Modal should close, showing the app
5. Check console - NO 404 errors for `/tokens/convex`

### Production Testing:
1. Visit https://treeshopterminal.com
2. Same flow as above
3. No console errors

---

## Common Issues & Fixes

### Issue: Still seeing 404 on /tokens/convex
**Fix:** JWT template not created properly. Go back to Step 1.

### Issue: "Unauthorized" error in Convex queries
**Fix:** Auth config not deployed. Run `npx convex deploy` again.

### Issue: Development keys warning
**Fix:** This is expected until you upgrade to production Clerk keys:
- Go to Clerk Dashboard → Settings → API Keys
- Generate production keys (pk_live_... and sk_live_...)
- Update env vars

### Issue: Users getting redirected away from treeshopterminal.com
**Fix:** Check that all Clerk URL env vars point to `/`:
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
```

---

## What This Fix Does

### Before:
- Clerk tries to get Convex token → 404 error
- Convex queries fail with "Unauthorized"
- Users can't access data
- Console filled with errors

### After:
- Clerk creates valid Convex JWT tokens ✓
- Convex accepts the tokens ✓
- Queries work properly ✓
- No console errors ✓
- Users stay on treeshopterminal.com ✓

---

## Next Steps After Configuration

1. **Test locally first** - Make sure it works at localhost:3002
2. **Update Vercel env vars** - Match your local .env.local
3. **Deploy to production** - Push to GitHub, Vercel auto-deploys
4. **Test production** - Visit treeshopterminal.com and verify
5. **Invite founding members** - Manually add users in Clerk Dashboard

---

## Emergency Rollback

If something breaks:

```bash
# Revert to old .env.local
git checkout HEAD -- .env.local

# Restart dev server
npm run dev
```

---

**Questions?** Check Clerk docs: https://clerk.com/docs/integrations/databases/convex
