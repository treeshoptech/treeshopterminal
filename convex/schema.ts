import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

/**
 * TreeShopTerminal Convex Schema
 * Multi-tenant, production-ready
 * Fields made optional for migration compatibility
 */

export default defineSchema({
  // ============================================
  // AUTHENTICATION (Convex Auth)
  // ============================================
  ...authTables,

  // Email whitelist for approved users
  whitelist: defineTable({
    email: v.string(),
    approved: v.boolean(),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // ============================================
  // MULTI-TENANT CORE
  // ============================================

  companies: defineTable({
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.string(),

    // Business Details
    industry: v.optional(v.string()),
    businessType: v.optional(v.string()),
    taxId: v.optional(v.string()),

    // Location
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    serviceRadius: v.optional(v.number()),

    // Billing
    stripeCustomerId: v.optional(v.string()),
    subscriptionTier: v.optional(v.string()),
    billingStatus: v.optional(v.string()),
    subscriptionStartDate: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),

    // Default Business Settings
    defaultSettings: v.optional(v.object({
      profitMargin: v.number(),
      travelRate: v.number(),
      bufferPercent: v.number(),
      burdenMultiplier: v.number(),
      timezone: v.string(),
      currency: v.string(),
    })),

    // Business Hours
    businessHours: v.optional(v.object({
      monday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      tuesday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      wednesday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      thursday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      friday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      saturday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
      sunday: v.object({ start: v.string(), end: v.string(), enabled: v.boolean() }),
    })),

    // Usage Tracking
    usage: v.optional(v.object({
      currentProjects: v.number(),
      currentEmployees: v.number(),
      currentEquipment: v.number(),
      currentLoadouts: v.number(),
      storageUsedGB: v.number(),
      mapViewsThisMonth: v.number(),
    })),

    // Onboarding
    onboardingComplete: v.optional(v.boolean()),
    setupSteps: v.optional(v.object({
      companyInfo: v.boolean(),
      firstEquipment: v.boolean(),
      firstLoadout: v.boolean(),
      firstEmployee: v.boolean(),
      firstProject: v.boolean(),
    })),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkOrgId", ["clerkOrgId"])
    .index("by_slug", ["slug"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  userProfiles: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    passwordHash: v.optional(v.string()), // For simple auth
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    currentOrgId: v.optional(v.string()),
    avatar: v.optional(v.string()),
    phone: v.optional(v.string()),
    title: v.optional(v.string()),

    preferences: v.optional(v.object({
      theme: v.string(),
      emailNotifications: v.boolean(),
      pushNotifications: v.boolean(),
      defaultView: v.string(),
      mapType: v.string(),
    })),

    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_currentOrgId", ["currentOrgId"]),

  equipment: defineTable({
    organizationId: v.string(),
    equipmentName: v.string(),
    category: v.optional(v.string()),
    purchasePrice: v.number(),
    purchaseDate: v.optional(v.number()),
    usefulLifeYears: v.number(),
    salvageValue: v.optional(v.number()),
    annualFinanceCost: v.number(),
    annualInsurance: v.number(),
    annualRegistration: v.number(),
    annualHours: v.number(),
    fuelType: v.optional(v.string()),
    fuelGallonsPerHour: v.number(),
    fuelPricePerGallon: v.number(),
    annualMaintenance: v.number(),
    annualRepairs: v.number(),
    ownershipCostPerHour: v.number(),
    operatingCostPerHour: v.number(),
    totalCostPerHour: v.number(),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    serialNumber: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    vin: v.optional(v.string()),
    lastServiceDate: v.optional(v.number()),
    nextServiceDate: v.optional(v.number()),
    serviceIntervalHours: v.optional(v.number()),
    currentHours: v.optional(v.number()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_category", ["category", "organizationId"])
    .index("by_status", ["status", "organizationId"]),

  loadouts: defineTable({
    organizationId: v.string(),
    loadoutName: v.string(),
    serviceType: v.optional(v.string()),
    equipmentIds: v.array(v.id("equipment")),
    crewSize: v.optional(v.number()),
    employees: v.optional(v.array(v.object({
      position: v.string(),
      baseWage: v.number(),
      burdenMultiplier: v.number(),
      trueCostPerHour: v.number(),
    }))),
    totalEquipmentCostPerHour: v.number(),
    totalLaborCostPerHour: v.number(),
    totalLoadoutCostPerHour: v.number(),
    productionRate: v.optional(v.number()),
    productionUnit: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    usageStats: v.optional(v.object({
      timesUsed: v.number(),
      totalHoursWorked: v.number(),
      averageProjectValue: v.number(),
      lastUsedDate: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_serviceType", ["serviceType", "organizationId"])
    .index("by_isActive", ["isActive", "organizationId"]),

  customers: defineTable({
    organizationId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    customerType: v.optional(v.string()),
    leadSource: v.optional(v.string()),
    leadScore: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),

    // Legacy fields (for migration)
    firstSource: v.optional(v.string()),
    lastSource: v.optional(v.string()),
    lifetimeValue: v.optional(v.number()),
    totalRevenue: v.optional(v.number()),
    totalSessions: v.optional(v.number()),
    stage: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
    lastContactedAt: v.optional(v.number()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_email", ["email", "organizationId"])
    .index("by_phone", ["phone", "organizationId"])
    .index("by_status", ["status", "organizationId"]),

  jobSites: defineTable({
    organizationId: v.string(),
    siteName: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    placeId: v.optional(v.string()),
    propertyType: v.optional(v.string()),
    acreage: v.optional(v.number()),
    lotSize: v.optional(v.number()),
    polygon: v.optional(v.array(v.object({
      lat: v.number(),
      lng: v.number(),
    }))),
    polygonArea: v.optional(v.number()),
    accessInstructions: v.optional(v.string()),
    gateCode: v.optional(v.string()),
    parkingInstructions: v.optional(v.string()),
    hazards: v.optional(v.array(v.string())),
    restrictions: v.optional(v.array(v.string())),
    customerId: v.optional(v.id("customers")),
    photos: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_status", ["status", "organizationId"])
    .index("by_customerId", ["customerId"]),

  projects: defineTable({
    organizationId: v.string(),
    projectName: v.string(),
    projectNumber: v.string(),
    customerId: v.id("customers"),
    jobSiteId: v.optional(v.id("jobSites")),
    serviceType: v.optional(v.string()),
    scope: v.optional(v.string()),
    loadoutId: v.optional(v.id("loadouts")),
    loadoutCostPerHour: v.optional(v.number()),
    profitMargin: v.optional(v.number()),
    billingRatePerHour: v.optional(v.number()),
    projectSize: v.optional(v.number()),
    sizeUnit: v.optional(v.string()),
    workHours: v.optional(v.number()),
    transportHours: v.optional(v.number()),
    bufferHours: v.optional(v.number()),
    totalHours: v.optional(v.number()),
    totalCost: v.optional(v.number()),
    totalPrice: v.optional(v.number()),
    totalProfit: v.optional(v.number()),
    estimatedStartDate: v.optional(v.number()),
    estimatedCompletionDate: v.optional(v.number()),
    actualStartDate: v.optional(v.number()),
    actualCompletionDate: v.optional(v.number()),
    assignedCrewLeadId: v.optional(v.id("employees")),
    assignedCrewMembers: v.optional(v.array(v.id("employees"))),
    status: v.optional(v.string()),
    completionPercentage: v.optional(v.number()),
    workOrderId: v.optional(v.id("workOrders")),
    invoiceId: v.optional(v.id("invoices")),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_projectNumber", ["projectNumber"])
    .index("by_status", ["status", "organizationId"])
    .index("by_customerId", ["customerId"]),

  timeClockEvents: defineTable({
    organizationId: v.string(),
    employeeId: v.id("employees"),
    eventType: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    accuracy: v.optional(v.number()),
    jobSiteId: v.optional(v.id("jobSites")),
    insideGeofence: v.optional(v.boolean()),
    distanceFromSite: v.optional(v.number()),
    deviceType: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
    validated: v.optional(v.boolean()),
    validatedBy: v.optional(v.string()),
    validationNotes: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_employeeId", ["employeeId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_jobSiteId", ["jobSiteId"]),

  timeEntries: defineTable({
    organizationId: v.string(),
    employeeId: v.id("employees"),
    date: v.number(),
    clockIn: v.number(),
    clockOut: v.optional(v.number()),
    totalHours: v.optional(v.number()),
    workType: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    jobSiteId: v.optional(v.id("jobSites")),
    breakDuration: v.optional(v.number()),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    approved: v.optional(v.boolean()),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_employeeId", ["employeeId"])
    .index("by_date", ["date"])
    .index("by_projectId", ["projectId"]),

  workOrders: defineTable({
    organizationId: v.string(),
    workOrderNumber: v.string(),
    projectId: v.optional(v.id("projects")),
    customerId: v.optional(v.id("customers")),
    jobSiteId: v.optional(v.id("jobSites")),
    scheduledDate: v.optional(v.number()),
    scheduledStartTime: v.optional(v.string()),
    estimatedDuration: v.optional(v.number()),
    actualStartTime: v.optional(v.number()),
    actualEndTime: v.optional(v.number()),
    assignedCrew: v.optional(v.array(v.id("employees"))),
    assignedEquipment: v.optional(v.array(v.id("equipment"))),
    crewLeadId: v.optional(v.id("employees")),
    siteAccessInstructions: v.optional(v.string()),
    safetyNotes: v.optional(v.string()),
    specialInstructions: v.optional(v.string()),
    status: v.optional(v.string()),
    completionNotes: v.optional(v.string()),
    completionPhotos: v.optional(v.array(v.string())),
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    customerSatisfactionRating: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_workOrderNumber", ["workOrderNumber"])
    .index("by_projectId", ["projectId"])
    .index("by_status", ["status", "organizationId"])
    .index("by_scheduledDate", ["scheduledDate"]),

  invoices: defineTable({
    organizationId: v.string(),
    invoiceNumber: v.string(),
    projectId: v.optional(v.id("projects")),
    workOrderId: v.optional(v.id("workOrders")),
    customerId: v.optional(v.id("customers")),
    lineItems: v.optional(v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      total: v.number(),
    }))),
    subtotal: v.number(),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    totalAmount: v.number(),
    dueDate: v.optional(v.number()),
    paymentTerms: v.optional(v.string()),
    amountPaid: v.optional(v.number()),
    amountDue: v.optional(v.number()),
    payments: v.optional(v.array(v.object({
      amount: v.number(),
      method: v.string(),
      paidAt: v.number(),
      transactionId: v.optional(v.string()),
    }))),
    status: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    paidInFullAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_invoiceNumber", ["invoiceNumber"])
    .index("by_customerId", ["customerId"])
    .index("by_status", ["status", "organizationId"]),

  employees: defineTable({
    organizationId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    position: v.optional(v.string()),
    department: v.optional(v.string()),
    employeeId: v.optional(v.string()),
    hireDate: v.optional(v.number()),
    baseHourlyRate: v.optional(v.number()),
    payType: v.optional(v.string()),
    burdenMultiplier: v.optional(v.number()),
    trueCostPerHour: v.optional(v.number()),
    status: v.optional(v.string()),
    terminationDate: v.optional(v.number()),
    terminationReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_email", ["email", "organizationId"])
    .index("by_employeeId", ["employeeId", "organizationId"])
    .index("by_status", ["status", "organizationId"]),

  notifications: defineTable({
    organizationId: v.string(),
    userId: v.optional(v.string()),
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    title: v.string(),
    message: v.string(),
    actionUrl: v.optional(v.string()),
    actionText: v.optional(v.string()),
    read: v.optional(v.boolean()),
    readAt: v.optional(v.number()),
    dismissed: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_read", ["read", "organizationId"]),

  workAreas: defineTable({
    organizationId: v.string(),
    jobSiteId: v.id('jobSites'),
    name: v.string(),
    polygon: v.array(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    area: v.number(),
    perimeter: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_jobSiteId", ["jobSiteId"]),

  quotes: defineTable({
    organizationId: v.string(),
    serviceType: v.string(),
    workAreaIds: v.array(v.id('workAreas')),
    lowPrice: v.number(),
    highPrice: v.number(),
    estimatedHours: v.number(),
    scopeOfWork: v.array(v.string()),
    whatsIncluded: v.array(v.string()),
    calculationDetails: v.any(),
    createdAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"]),
});
