import { Password } from "@convex-dev/auth/providers/Password";

export default {
  providers: [
    Password({
      // Allow passwordless magic link authentication
      verify: async (params: {
        email: string;
        code?: string;
      }) => {
        // For now, accept any email without verification
        // In production, you'd send a verification code via email
        return true;
      },
    }),
  ],
};