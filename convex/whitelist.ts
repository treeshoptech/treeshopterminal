import { query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Email Whitelist for Manual Approval
 * Only these emails can login
 */

const APPROVED_EMAILS = [
  'office@fltreeshop.com',
  'lockin@treeshop.app',
  // Add more approved emails here
];

export const isEmailApproved = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return APPROVED_EMAILS.includes(args.email.toLowerCase());
  },
});

export const getApprovedEmails = query({
  handler: async () => {
    return APPROVED_EMAILS;
  },
});
