import { mutation } from "./_generated/server";

export default mutation({
  args: {},
  handler: async (ctx) => {
    const inviteCode = `admin-${Date.now()}`;

    const inviteId = await ctx.db.insert("userInvites", {
      email: "treeshoptech@icloud.com",
      firstName: "Admin",
      lastName: "User",
      companyName: "TreeShop",
      inviteCode,
      status: "pending",
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return { inviteCode, inviteId };
  },
});
