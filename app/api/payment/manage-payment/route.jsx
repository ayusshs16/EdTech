import { NextResponse } from "next/server";

// Payments disabled — return 410 Gone so callers know the feature is removed.
export async function POST() {
  return NextResponse.json({ error: "Payments disabled" }, { status: 410 });
}
