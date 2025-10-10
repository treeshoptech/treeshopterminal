# Auth Abstraction Layer

## Current State: Mock Auth

All auth flows use mock data for development.

## Components Use:

```typescript
'use client';
import { useAuth } from '@/lib/auth';

function MyComponent() {
  const { user, organization, isSignedIn } = useAuth();
  // Works with both mock and real Clerk
}
```

## Server Components Use:

```typescript
import { getAuth } from '@/lib/auth';

export default async function Page() {
  const { userId, orgId } = await getAuth();
  // Works with both mock and real Clerk
}
```

## Switch to Real Clerk:

1. Get Clerk keys from dashboard.clerk.com
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
   CLERK_SECRET_KEY=sk_live_xxx
   ```

3. Update `lib/auth/index.ts`:
   ```typescript
   const USE_MOCK_AUTH = false; // Change to false
   ```

4. Uncomment Clerk exports in `lib/auth/index.ts`

5. Update `middleware.ts` to use `clerkMiddleware`

**No component changes needed.** Auth abstraction handles the swap.
