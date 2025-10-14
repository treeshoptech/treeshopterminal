# Vercel Environment Variables Setup

## REMOVE These Clerk Variables from Vercel:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
```

## REQUIRED Variables for Convex Auth:
```
# Convex (KEEP these)
NEXT_PUBLIC_CONVEX_URL=https://earnest-lemming-634.convex.cloud
CONVEX_DEPLOY_KEY=prod:earnest-lemming-634|eyJ2MiI6IjRlNTVmYWNiMzVhZDQyNzk4ZTYyNDRiZDQyYmEwZTczIn0=

# Convex Auth (ADD this new one)
CONVEX_SITE_URL=https://treeshopterminal.com

# Application (KEEP these)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCUKaBZ4zGS9pMHWgDM0P8PlrwWO4C-fJY
NEXT_PUBLIC_BASE_URL=https://treeshopterminal.com
```

## How to update in Vercel:
1. Go to https://vercel.com/treeshoptech/treeshop-terminal/settings/environment-variables
2. Delete all CLERK_* variables
3. Add CONVEX_SITE_URL=https://treeshopterminal.com
4. Redeploy

After updating, trigger a new deployment:
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"
