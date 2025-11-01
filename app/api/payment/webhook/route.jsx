import { NextResponse } from "next/server";

// Payments are disabled. Respond with 410 so Stripe sees the endpoint but no work is done.
export async function POST() {
  return NextResponse.json({ error: "Payments disabled" }, { status: 410 });
}
