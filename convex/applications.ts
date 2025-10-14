import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit a new application (public - no auth required)
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    companyName: v.string(),
    businessType: v.string(),
    businessTypeOther: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already has pending/approved application
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "approved")
        )
      )
      .first();

    if (existing) {
      throw new Error(
        "An application with this email already exists. Please contact support."
      );
    }

    const applicationId = await ctx.db.insert("applications", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return applicationId;
  },
});

// List all applications (admin only - checks auth in frontend)
export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let applications = ctx.db.query("applications");

    if (args.status) {
      applications = applications.withIndex("by_status", (q) =>
        q.eq("status", args.status)
      );
    } else {
      applications = applications.withIndex("by_createdAt");
    }

    return await applications.order("desc").collect();
  },
});

// Get single application
export const get = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Approve application and create invite
export const approve = mutation({
  args: {
    id: v.id("applications"),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.id);
    if (!application) {
      throw new Error("Application not found");
    }

    // Generate unique invite code
    const inviteCode = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create invite
    const inviteId = await ctx.db.insert("userInvites", {
      email: application.email,
      firstName: application.name.split(" ")[0],
      lastName: application.name.split(" ").slice(1).join(" ") || "",
      companyName: application.companyName,
      inviteCode,
      status: "pending",
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Update application
    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedAt: Date.now(),
      reviewNotes: args.reviewNotes,
      inviteId,
      updatedAt: Date.now(),
    });

    return { inviteCode, inviteId };
  },
});

// Deny application
export const deny = mutation({
  args: {
    id: v.id("applications"),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.id);
    if (!application) {
      throw new Error("Application not found");
    }

    await ctx.db.patch(args.id, {
      status: "denied",
      reviewedAt: Date.now(),
      reviewNotes: args.reviewNotes,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete application
export const remove = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
