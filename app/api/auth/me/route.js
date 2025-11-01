import { clerkClient, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // auth() reads the current session/user from the incoming request in the
  // Next.js app router when using Clerk's middleware and SDK.
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    // Only return safe/public fields
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      primaryEmail: user.primaryEmailAddress?.emailAddress || null,
      emailAddresses: (user.emailAddresses || []).map((e) => e.emailAddress),
      profileImageUrl: user.profileImageUrl,
      username: user.username || null,
    };

    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("Failed to fetch Clerk user:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
