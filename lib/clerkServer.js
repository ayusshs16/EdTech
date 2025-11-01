import { clerkClient, auth } from "@clerk/nextjs/server";

/**
 * Returns the Clerk user for the currently authenticated session.
 * Throws an Error with name 'UNAUTHORIZED' when there is no user.
 */
export async function getCurrentUserOrThrow() {
  const { userId } = auth();
  if (!userId) {
    const e = new Error("Unauthorized");
    e.name = "UNAUTHORIZED";
    throw e;
  }

  const user = await clerkClient.users.getUser(userId);
  return user;
}

export async function getSafeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    primaryEmail: user.primaryEmailAddress?.emailAddress || null,
    emailAddresses: (user.emailAddresses || []).map((e) => e.emailAddress),
    profileImageUrl: user.profileImageUrl,
    username: user.username || null,
  };
}
