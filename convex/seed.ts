import { internalMutation } from './_generated/server';

/**
 * Seed initial whitelist with approved emails
 * Run this once after deploying the schema
 */
export const seedWhitelist = internalMutation({
  handler: async (ctx) => {
    const approvedEmails = [
      'office@fltreeshop.com',
      'lockin@treeshop.app',
      'test@test.com',
    ];

    for (const email of approvedEmails) {
      const existing = await ctx.db
        .query('whitelist')
        .withIndex('by_email', (q) => q.eq('email', email))
        .first();

      if (!existing) {
        await ctx.db.insert('whitelist', {
          email: email.toLowerCase(),
          approved: true,
          approvedAt: Date.now(),
          notes: 'Initial seed data',
          createdAt: Date.now(),
        });
        console.log(`✅ Added ${email} to whitelist`);
      } else {
        console.log(`⏭️  ${email} already in whitelist`);
      }
    }

    console.log('✨ Whitelist seeding complete!');
  },
});
