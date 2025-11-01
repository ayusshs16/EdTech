import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { user, sendToInngest = false } = await req.json();

  if (!sendToInngest) {
    // Return early without calling Inngest. This lets callers create users
    // or show user info without triggering background jobs.
    return NextResponse.json({ result: { stub: true, message: "Inngest not triggered" } });
  }

  const result = await inngest.send({
    name: "user.create",
    data: {
      user: user,
    },
  });
  return NextResponse.json({ result });
}
