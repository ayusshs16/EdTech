import { NextResponse } from "next/server";

// Payments are disabled in this deployment. This endpoint kept as a stub to
// avoid 404s from client code. It always returns 410 Gone.
export async function POST() {
  return NextResponse.json({ error: "Payments disabled" }, { status: 410 });
}
