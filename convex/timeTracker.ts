import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Clock in
export const clockIn = mutation({
  args: {
    organizationId: v.string(),
    employeeId: v.id('employees'),
    projectId: v.optional(v.id('projects')),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const eventId = await ctx.db.insert('timeClockEvents', {
      organizationId: args.organizationId,
      employeeId: args.employeeId,
      eventType: 'clock_in',
      coordinates: { lat: 0, lng: 0 }, // Optional for now
      timestamp: now,
      validated: true,
    });

    return eventId;
  },
});

// Clock out
export const clockOut = mutation({
  args: {
    organizationId: v.string(),
    employeeId: v.id('employees'),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get last clock in
    const events = await ctx.db
      .query('timeClockEvents')
      .withIndex('by_employeeId', (q) => q.eq('employeeId', args.employeeId))
      .order('desc')
      .take(10);

    const lastClockIn = events.find(e => e.eventType === 'clock_in');

    if (!lastClockIn) {
      throw new Error('No clock in found');
    }

    // Create clock out event
    await ctx.db.insert('timeClockEvents', {
      organizationId: args.organizationId,
      employeeId: args.employeeId,
      eventType: 'clock_out',
      coordinates: { lat: 0, lng: 0 },
      timestamp: now,
      validated: true,
    });

    // Create time entry
    const totalHours = (now - lastClockIn.timestamp) / (1000 * 60 * 60);
    const date = new Date(lastClockIn.timestamp).setHours(0, 0, 0, 0);

    const entryId = await ctx.db.insert('timeEntries', {
      organizationId: args.organizationId,
      employeeId: args.employeeId,
      date,
      clockIn: lastClockIn.timestamp,
      clockOut: now,
      totalHours: Number(totalHours.toFixed(2)),
      workType: 'productive',
      approved: false,
      createdAt: now,
      updatedAt: now,
    });

    return { entryId, totalHours };
  },
});

// Get current status
export const getCurrentStatus = query({
  args: {
    organizationId: v.string(),
    employeeId: v.id('employees'),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query('timeClockEvents')
      .withIndex('by_employeeId', (q) => q.eq('employeeId', args.employeeId))
      .order('desc')
      .take(1);

    if (events.length === 0) {
      return { status: 'clocked_out' };
    }

    const lastEvent = events[0];

    if (lastEvent.eventType === 'clock_in') {
      return {
        status: 'clocked_in',
        since: lastEvent.timestamp,
        elapsed: Date.now() - lastEvent.timestamp,
      };
    }

    return { status: 'clocked_out' };
  },
});

// List time entries
export const listEntries = query({
  args: {
    organizationId: v.string(),
    employeeId: v.optional(v.id('employees')),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('timeEntries');

    const entries = await query.collect();

    let filtered = entries.filter(e => e.organizationId === args.organizationId);

    if (args.employeeId) {
      filtered = filtered.filter(e => e.employeeId === args.employeeId);
    }

    if (args.startDate) {
      filtered = filtered.filter(e => e.date >= args.startDate!);
    }

    if (args.endDate) {
      filtered = filtered.filter(e => e.date <= args.endDate!);
    }

    return filtered.sort((a, b) => b.date - a.date);
  },
});

// Approve entry
export const approveEntry = mutation({
  args: {
    id: v.id('timeEntries'),
    approvedBy: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      approved: true,
      approvedBy: args.approvedBy,
      approvedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update entry
export const updateEntry = mutation({
  args: {
    id: v.id('timeEntries'),
    clockIn: v.optional(v.number()),
    clockOut: v.optional(v.number()),
    totalHours: v.optional(v.number()),
    projectId: v.optional(v.id('projects')),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete entry
export const deleteEntry = mutation({
  args: { id: v.id('timeEntries') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
