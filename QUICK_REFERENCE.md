# TreeShopTerminal Quick Reference
## Essential Files & Commands at a Glance

---

## PROJECT BASICS

**Location:** `/Users/lockin/treeshopterminal`
**Live:** https://treeshopterminal.com
**Repo:** https://github.com/treeshoptech/treeshopterminal
**Stack:** Next.js 14 + Convex + Clerk + React 18 + TypeScript

---

## START HERE (Local Development)

```bash
cd /Users/lockin/treeshopterminal

# Terminal 1: Next.js dev server
npm run dev
# → http://localhost:3002

# Terminal 2: Convex backend
npx convex dev

# First time?
npm install
cp .env.example .env.local
# Fill in CONVEX_URL and CLERK keys
```

---

## CRITICAL FILES YOU MUST KNOW

### Database Schema
- **File:** `convex/schema.ts` (~500 lines)
- **What:** All 14 database tables
- **When to edit:** Adding new data types
- **DO NOT:** Remove tables or fields without migration

### Pricing Formulas
- **File:** `lib/formulas/pricing.ts` (~500 lines)
- **What:** All 6 TreeShop pricing steps
- **When to edit:** Changing pricing logic
- **DO NOT:** Modify formula calculations without testing

### Authentication
- **File:** `middleware.ts` (25 lines)
- **What:** Route protection with Clerk
- **When to edit:** Adding public routes
- **DO NOT:** Disable for production

### Root Layout (Providers)
- **File:** `app/layout.tsx` (50 lines)
- **What:** Clerk + Convex setup
- **When to edit:** Adding new providers
- **DO NOT:** Remove Convex or Clerk wrappers

### Environment Variables
- **File:** `.env.local` (production: Vercel settings)
- **What:** Convex URL, Clerk keys, API keys
- **When to edit:** Deploying to new environment
- **DO NOT:** Commit to git

---

## DIRECTORY MAP

```
app/                          Pages (Route handlers)
  page.tsx                    Dashboard (start here)
  equipment/page.tsx          Equipment library
  employees/page.tsx          Team management
  loadouts/page.tsx           Service configurations
  pricing/page.tsx            Pricing calculators
  projects/page.tsx           Project pipeline
  settings/page.tsx           Organization settings
  sign-in/                    Clerk auth pages

components/                   Reusable UI
  layout/                     Navigation, theme
  ui/                         Buttons, cards, modals
  providers/                  Convex + Clerk setup
  team/                       Employee components
  customers/                  Customer components
  time/                       Time tracking components

convex/                       Backend (Serverless functions)
  schema.ts                   Database schema
  auth.ts                     Authentication
  equipment.ts                Equipment CRUD
  employees.ts                Employee CRUD
  [20+ other modules]         Other entity CRUD

lib/
  formulas/pricing.ts         ALL pricing calculations
  hooks/useOrganization.ts    Get org ID from Clerk
  maps/google-maps.ts         Google Maps utilities

styles/                       CSS/Design system
  variables.css               Design tokens
  globals.css                 Global styles
  design-system.css           Component styles
```

---

## HOW TO...

### Add a New Page
1. Create `app/new-feature/page.tsx`
2. Use `useOrganization()` to get org ID
3. Use `useQuery()` for Convex queries
4. Import UI components from `components/ui`

### Add a Database Table
1. Edit `convex/schema.ts` - add defineTable
2. Create `convex/newTable.ts` - add CRUD functions
3. Run `npx convex dev` to deploy
4. Use in frontend via `api.newTable.list()`

### Call Backend Function
```typescript
// Frontend (React component)
const data = useQuery(api.equipment.list, organizationId ? {} : 'skip');

// Backend (convex/equipment.ts)
export const list = query({
  handler: async (ctx) => {
    const orgId = await getCurrentOrganizationId(ctx);
    return ctx.db.query("equipment")
      .filter(q => q.eq(q.field("organizationId"), orgId))
      .collect();
  }
});
```

### Deploy to Production
1. Push to `main` branch
2. Vercel auto-deploys
3. Check https://treeshopterminal.com

### Check Logs
- **Frontend:** Browser console (DevTools)
- **Backend:** Convex dashboard https://dashboard.convex.dev
- **Deployment:** Vercel dashboard https://vercel.com

---

## COMMON PATTERNS

### Authentication Check
```typescript
const { organizationId, isLoaded } = useOrganization();
if (!isLoaded) return <Loading />;
if (!organizationId) return <SignedOut />;
```

### Query Data
```typescript
const equipment = useQuery(
  api.equipment.list,
  organizationId ? {} : 'skip'
);
```

### Mutation (Create/Update/Delete)
```typescript
const equipment = useMutation(api.equipment.create);
await equipment({ name: "Excavator", cost: 100 });
```

### Calculate Price
```typescript
import { calculateEquipmentCost } from '@/lib/formulas/pricing';

const result = calculateEquipmentCost({
  purchasePrice: 325000,
  usefulLifeYears: 7,
  // ... other params
});
```

---

## ENVIRONMENT VARIABLES

### Development (.env.local)
```
NEXT_PUBLIC_CONVEX_URL=https://effervescent-horse-265.convex.cloud
CONVEX_DEPLOYMENT=dev:enduring-weasel-794
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3002
```

### Production (Vercel Dashboard)
```
NEXT_PUBLIC_CONVEX_URL=https://effervescent-horse-265.convex.cloud
CONVEX_DEPLOYMENT=prod:effervescent-horse-265
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_BASE_URL=https://treeshopterminal.com
```

---

## WHAT'S BUILT

- ✅ Dashboard with KPIs
- ✅ Equipment library
- ✅ Employee management
- ✅ Cost calculators (equipment, labor)
- ✅ Pricing formulas (all 6 steps)
- ✅ Work order wizard
- ✅ Quote generation
- ✅ Multi-tenant architecture
- ✅ Clerk authentication
- ✅ Convex real-time database

---

## WHAT'S COMING

- [ ] PDF proposal generation
- [ ] Customer approval workflow
- [ ] Time tracking with GPS
- [ ] Invoice system
- [ ] Reporting dashboards
- [ ] AFISS complexity factors
- [ ] Mobile app (crew time clock)

---

## TROUBLESHOOTING

### Port 3002 already in use
```bash
kill $(lsof -t -i :3002)
npm run dev
```

### Convex sync issues
```bash
npx convex dev --no-auto-deploy
```

### Clerk not authenticating
- Check `CLERK_SECRET_KEY` in .env.local
- Verify domain in Clerk dashboard
- Clear browser cookies

### Build fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## DOCUMENTATION FILES

- **README.md** - Features and workflows
- **CODEBASE_ANALYSIS.md** - Complete architecture (this project)
- **DEPLOYMENT.md** - Vercel deployment guide
- **CLERK-CONVEX-SETUP.md** - Auth setup
- **FEATURES-COMPLETED.md** - Completed features list

---

## CONTACT & LINKS

- **GitHub:** https://github.com/treeshoptech/treeshopterminal
- **Live:** https://treeshopterminal.com
- **Convex Dashboard:** https://dashboard.convex.dev
- **Vercel Dashboard:** https://vercel.com/treeshoptech/treeshopterminal
- **Clerk Dashboard:** https://dashboard.clerk.com

---

**Last Updated:** 2025-11-05
**Status:** Production-ready
