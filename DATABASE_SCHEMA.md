# TreeShopTerminal Database Schema
## Convex Multi-Tenant Architecture

---

## SCHEMA OVERVIEW

14 tables in total, all with multi-tenant isolation via `organizationId` field.

```
┌─────────────────────────────────────────────────────────────┐
│                  MULTI-TENANT CORE                          │
├─────────────────────────────────────────────────────────────┤
│ companies          │ companies.ts       │ Organization records
│ userProfiles       │ auth.ts            │ User preferences/auth
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              BUSINESS OPERATIONS                            │
├─────────────────────────────────────────────────────────────┤
│ equipment          │ equipment.ts       │ Asset library
│ employees          │ employees.ts       │ Crew roster
│ loadouts           │ loadouts.ts        │ Configurations
│ customers          │ customers.ts       │ Client directory
│ jobSites           │ jobSites.ts        │ Physical locations
│ workAreas          │ workAreas.ts       │ Polygons on sites
│ projects           │ projects.ts        │ Projects
│ workOrders         │ workOrders.ts      │ Job assignments
│ quotes             │ quotes.ts          │ Pricing quotes
│ timeEntries        │ timeTracker.ts     │ Time tracking
│ invoices           │ (future)           │ Billing records
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SECURITY                                 │
├─────────────────────────────────────────────────────────────┤
│ whitelist          │ whitelist.ts       │ Access control
└─────────────────────────────────────────────────────────────┘
```

---

## TABLE DEFINITIONS

### 1. companies (Multi-Tenant Root)

```typescript
{
  clerkOrgId: string              // Links to Clerk org
  name: string                    // Company name
  slug: string                    // URL-safe name
  
  // Business Details
  industry: string?               // e.g. "Tree Service"
  businessType: string?           // e.g. "LLC"
  taxId: string?                  // Tax/EIN number
  
  // Location (service base)
  address: string?
  city: string?
  state: string?
  zipCode: string?
  coordinates: {lat, lng}?       // Service area center
  serviceRadius: number?          // Miles
  
  // Billing
  stripeCustomerId: string?
  subscriptionTier: string?       // e.g. "founding", "pro"
  billingStatus: string?
  subscriptionStartDate: number?
  trialEndsAt: number?
  
  // Default Settings
  defaultSettings: {
    profitMargin: number           // 0.30 - 0.70
    travelRate: number             // 0.50 (50%)
    bufferPercent: number          // 0.10 (10%)
    burdenMultiplier: number       // 1.6 - 2.0
    timezone: string               // e.g. "EST"
    currency: string               // e.g. "USD"
  }?
  
  // Business Hours
  businessHours: {
    monday: {start, end, enabled}?
    tuesday: {start, end, enabled}?
    // ... 5 more days
  }?
  
  // Usage Tracking
  usage: {
    currentProjects: number
    currentEmployees: number
    currentEquipment: number
    currentLoadouts: number
    storageUsedGB: number
    mapViewsThisMonth: number
  }?
  
  // Onboarding
  onboardingComplete: boolean?
  setupSteps: {
    companyInfo: boolean
    firstEquipment: boolean
    firstLoadout: boolean
    firstEmployee: boolean
    firstProject: boolean
  }?
  
  // Timestamps
  createdAt: number
  updatedAt: number
  
  // Indexes
  by_clerkOrgId
  by_slug
  by_stripeCustomerId
}
```

### 2. userProfiles

```typescript
{
  clerkUserId: string             // Links to Clerk user
  email: string
  passwordHash: string?           // Optional local auth
  
  // Profile
  firstName: string?
  lastName: string?
  currentOrgId: string?           // Which org logged in
  avatar: string?
  phone: string?
  title: string?
  
  // Preferences
  preferences: {
    theme: string                 // "light" | "dark"
    emailNotifications: boolean
    pushNotifications: boolean
    defaultView: string           // "dashboard" | etc
    mapType: string               // "satellite" | "roadmap"
  }?
  
  // Timestamps
  createdAt: number
  updatedAt: number
  lastLoginAt: number?
  
  // Indexes
  by_clerkUserId
  by_email
  by_currentOrgId
}
```

### 3. equipment

```typescript
{
  organizationId: string          // Multi-tenant isolation
  equipmentName: string
  category: string?               // "Truck", "Mulcher", "Grinder"
  
  // Purchase Info
  purchasePrice: number           // $$$
  purchaseDate: number?
  usefulLifeYears: number
  salvageValue: number?
  
  // Ownership Costs (Annual)
  annualFinanceCost: number       // Loan/lease payments
  annualInsurance: number
  annualRegistration: number
  annualHours: number             // Expected yearly operation
  
  // Operating Costs (Annual)
  fuelType: string?               // "Diesel", "Gas"
  fuelGallonsPerHour: number
  fuelPricePerGallon: number
  annualMaintenance: number
  annualRepairs: number
  
  // Calculated Values (read-only, computed by formula)
  ownershipCostPerHour: number    // Calculated
  operatingCostPerHour: number    // Calculated
  totalCostPerHour: number        // Calculated
  
  // Identification
  make: string?                   // Brand
  model: string?
  year: number?
  serialNumber: string?
  licensePlate: string?
  vin: string?
  
  // Maintenance
  lastServiceDate: number?
  nextServiceDate: number?
  serviceIntervalHours: number?
  currentHours: number?           // Odometer equivalent
  
  // Status
  status: string?                 // "Active", "Maintenance", "Retired"
  notes: string?
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 4. employees

```typescript
{
  organizationId: string          // Multi-tenant
  name: string
  email: string
  position: string                // "Entry Ground Crew", "Climber", etc
  
  // Employment
  hireDate: number?
  baseHourlyRate: number          // $35/hr example
  burdenMultiplier: number        // 1.6 - 2.0 based on position
  
  // Calculated Values
  trueCostPerHour: number         // baseRate × multiplier
  annualBaseCost: number          // baseRate × annualHours
  annualBurdenCost: number        // Taxes, insurance, overhead
  annualTotalCost: number         // Base + burden
  
  // Additional Info
  phone: string?
  emergencyContact: string?
  certification: string?          // Arborist license, etc
  licenseExpiration: number?
  
  // Status
  status: string?                 // "Active", "On Leave", "Inactive"
  department: string?             // "Ground Crew", "Operations"
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 5. loadouts

```typescript
{
  organizationId: string          // Multi-tenant
  name: string                    // "Cat 265 Crew", "SK200TR Crew"
  
  // Configuration
  equipmentIds: string[]          // References to equipment table
  employeeIds: string[]           // References to employees table
  
  // Production
  productionRate: number          // IA/hr (inch-acres per hour)
  productionUnit: string          // "IA", "points", "day"
  
  // Costs
  totalEquipmentCost: number      // $/hour
  totalLaborCost: number          // $/hour
  overheadCost: number?           // $/hour
  loadoutCostPerHour: number      // Equipment + Labor + Overhead
  
  // Billing at Different Margins
  billingRates: {
    margin30: number              // Cost ÷ 0.70
    margin40: number              // Cost ÷ 0.60
    margin50: number              // Cost ÷ 0.50 (default)
    margin60: number              // Cost ÷ 0.40
    margin70: number              // Cost ÷ 0.30
  }?
  
  // Service Type
  serviceType: string?            // "Mulching", "Stump", "Clearing"
  
  // Notes
  notes: string?
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 6. customers

```typescript
{
  organizationId: string          // Multi-tenant
  
  // Contact Info
  name: string
  company: string?
  email: string
  phone: string
  
  // Address
  address: string
  city: string
  state: string
  zipCode: string
  coordinates: {lat, lng}?
  
  // Relationship
  status: string?                 // "Active", "Inactive", "Prospect"
  source: string?                 // "Website", "Referral", "Ad"
  notes: string?
  preferredContact: string?       // "Email", "Phone", "Text"
  
  // Billing
  billingAddress: string?
  taxId: string?
  
  // History
  jobCount: number?               // How many jobs
  totalRevenue: number?           // $ from this customer
  averageJobValue: number?        // $
  lastJobDate: number?
  
  // Timestamps
  createdAt: number
  updatedAt: number
  
  // Indexes
  by_organizationId
}
```

### 7. jobSites

```typescript
{
  organizationId: string          // Multi-tenant
  customerId: string              // References customers
  
  // Location
  address: string
  city: string
  state: string
  zipCode: string
  coordinates: {lat, lng}         // For maps
  
  // Site Details
  totalAcreage: number?
  terrainType: string?            // "Flat", "Hilly", "Dense"
  accessRoad: string?             // "Good", "Rough", "None"
  notes: string?
  
  // Metadata
  site_name: string?
  propertyType: string?           // "Residential", "Commercial"
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 8. workAreas (Polygons on Job Sites)

```typescript
{
  organizationId: string
  jobSiteId: string               // Parent site
  
  // Boundary
  name: string                    // "Front Clearing", "Back Woods"
  polygon: Array<{lat, lng}>      // Vertices of polygon
  area: number                    // Acres (calculated)
  perimeter: number?              // Miles (calculated)
  
  // Metadata
  workType: string?               // "Mulching", "Clearing", "Stump"
  density: string?                // "Light", "Medium", "Heavy"
  
  // Status
  status: string?                 // "Pending", "In Progress", "Complete"
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 9. projects

```typescript
{
  organizationId: string
  customerId: string              // Customer reference
  jobSiteId: string?              // Site reference
  
  // Project Info
  name: string
  description: string?
  projectType: string?            // "Mulching", "Clearing", "Tree Removal"
  
  // Status Workflow
  status: string                  // "Lead", "Proposal", "Work Order", "Invoice"
  
  // Dates
  startDate: number?
  endDate: number?
  completionDate: number?
  
  // Financial
  estimatedValue: number?
  actualValue: number?
  profitMargin: number?           // 0.50 = 50%
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 10. workOrders

```typescript
{
  organizationId: string
  projectId: string               // Parent project
  quoteId: string?                // Linked quote
  
  // Work Assignment
  jobSiteId: string
  workAreaIds: string[]           // Multiple work areas
  
  // Execution
  assignedCrew: string?           // Crew name
  loadoutId: string?              // Equipment config used
  
  // Timeline
  scheduledDate: number?
  startedDate: number?
  completedDate: number?
  
  // Work Details
  workType: string                // Service type
  scope: string                   // Description of work
  
  // Status
  status: string                  // "Scheduled", "In Progress", "Complete"
  
  // Notes
  notes: string?
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 11. quotes

```typescript
{
  organizationId: string
  workOrderId: string?
  customerId: string
  
  // Calculation Results
  serviceType: string             // "Mulching", "Stump", "Clearing"
  
  // Work Volume
  totalScore: number              // IA, points, or days
  totalHours: number              // Production hours
  transportHours: number
  bufferHours: number
  totalBillableHours: number
  
  // Pricing
  hourlyRate: number              // Billing rate
  subtotal: number                // Hours × Rate
  discountPercent: number?
  discountAmount: number?
  tax: number?
  total: number                   // Final price
  
  // Cost Breakdown (internal)
  costPerHour: number?            // Our cost
  profitMargin: number?           // 0.50 = 50%
  profitAmount: number?           // Total profit
  
  // Details
  scopeOfWork: string[]           // Bullet points
  whatIsIncluded: string[]        // Deliverables
  whatIsNotIncluded: string[]     // Exclusions
  timeline: string                // Estimated hours on-site
  
  // Status
  status: string                  // "Draft", "Sent", "Approved", "Rejected"
  validUntil: number?
  
  // Customer Approval
  sentDate: number?
  viewedDate: number?
  approvedDate: number?
  approvedBy: string?
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 12. timeEntries

```typescript
{
  organizationId: string
  employeeId: string
  workOrderId: string?
  
  // Time
  startTime: number               // Unix timestamp
  endTime: number?
  duration: number?               // Minutes
  
  // Location
  jobSiteId: string?
  latitude: number?
  longitude: number?              // GPS track
  
  // Work Details
  workType: string?
  notes: string?
  
  // Status
  status: string                  // "Clocked In", "Complete", "Approved"
  approvedDate: number?
  approvedBy: string?
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 13. invoices (Future)

```typescript
{
  organizationId: string
  customerId: string
  workOrderId: string
  quoteId: string?
  
  // Invoice Details
  invoiceNumber: string           // "INV-001"
  invoiceDate: number
  dueDate: number
  
  // Items
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  
  // Financial
  subtotal: number
  tax: number
  total: number
  
  // Payment
  status: string                  // "Draft", "Sent", "Paid", "Overdue"
  paidDate: number?
  paymentMethod: string?
  
  // Notes
  notes: string?
  internalNotes: string?
  
  // Timestamps
  createdAt: number
  updatedAt: number
}
```

### 14. whitelist (Security)

```typescript
{
  organizationId: string
  userId: string
  email: string
  
  // Permissions
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  canApprove: boolean             // For quotes/invoices
  canViewReports: boolean
  canManageTeam: boolean
  canManageEquipment: boolean
  canManagePricing: boolean
  
  // Role
  role: string                    // "Admin", "Manager", "Estimator", "Crew"
  
  // Status
  status: string                  // "Active", "Inactive"
  addedDate: number
  
  // Timestamps
  updatedAt: number
}
```

---

## MULTI-TENANT ARCHITECTURE

Every table (except `companies` and `userProfiles`) has this field:

```typescript
organizationId: string
```

This ensures:
1. **Data Isolation** - Users only see their organization's data
2. **Security** - Backend filters all queries by organizationId
3. **Scalability** - Multiple customers on one database
4. **Simplicity** - Single database, no per-tenant sharding needed

### Example Query (Safe)
```typescript
// Query all equipment for this organization
export const list = query({
  handler: async (ctx) => {
    const orgId = await getCurrentOrganizationId(ctx);
    return ctx.db.query("equipment")
      .filter(q => q.eq(q.field("organizationId"), orgId))
      .collect();
  }
});
```

---

## INDEXES FOR PERFORMANCE

Every table has these indexes:

```typescript
// By organization (filter starting point)
.index("by_organizationId", ["organizationId"])

// By specific fields (common queries)
.index("by_customerId", ["organizationId", "customerId"])
.index("by_status", ["organizationId", "status"])
.index("by_jobSiteId", ["organizationId", "jobSiteId"])
```

---

## FIELD NAMING CONVENTIONS

- **IDs:** `string` (Convex auto-generates)
- **Numbers:** `number` (int or float)
- **Dates:** `number` (Unix timestamp in milliseconds)
- **Booleans:** `boolean`
- **Strings:** `string`
- **Optional:** `string?` (type with ?)
- **Arrays:** `string[]` (array notation)
- **Objects:** `{key: type}` (inline)

---

## RELATIONSHIPS

```
companies (1)
  ├── userProfiles (many)
  ├── equipment (many)
  ├── employees (many)
  ├── loadouts (many)
  ├── customers (many)
  │   ├── jobSites (many)
  │   │   ├── workAreas (many)
  │   │   └── workOrders (many)
  │   │       ├── quotes (many)
  │   │       └── timeEntries (many)
  │   └── projects (many)
  │       └── quotes (many)
  └── whitelist (many)
```

---

## HOW TO ADD A TABLE

1. **Define in schema.ts:**
```typescript
defineTable({
  organizationId: v.string(),
  // ... your fields
})
.index("by_organizationId", ["organizationId"])
```

2. **Create CRUD in convex/newTable.ts:**
```typescript
export const list = query({
  handler: async (ctx) => {
    const orgId = await getCurrentOrganizationId(ctx);
    return ctx.db.query("newTable")
      .filter(q => q.eq(q.field("organizationId"), orgId))
      .collect();
  }
});
```

3. **Deploy:**
```bash
npx convex dev
```

4. **Use in frontend:**
```typescript
const data = useQuery(api.newTable.list);
```

---

**Schema Version:** 1.0  
**Last Updated:** Oct 13, 2024  
**Status:** Production  
