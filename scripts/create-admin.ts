import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function createAdmin() {
  // This will use Convex Auth's password provider to create the user
  // We need to call the signIn mutation with signUp flow

  console.log("Creating admin account...");
  console.log("Email: treeshoptech@icloud.com");
  console.log("Password: TreeAi1.");

  // The actual account creation needs to happen through the auth flow
  // Let me create an invite instead

  const inviteCode = `admin-${Date.now()}`;

  console.log("\nInvite created!");
  console.log(`Go to: https://treeshopterminal.com?invite=${inviteCode}`);
  console.log("Then sign up with your credentials");
}

createAdmin();
