import { inngest } from "../../../inngest/client";
export const runtime = "edge";

// Simple edge-friendly route that forwards events to the inngest client.
// Accepts POST { name, data } and calls `inngest.send` (stub or real client).
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, data } = body || {};
    if (!name) {
      return new Response(JSON.stringify({ error: "Missing event name" }), { status: 400 });
    }

    if (!inngest || typeof inngest.send !== "function") {
      // In stub mode, log and return a harmless response
      console.warn("[inngest route] inngest client not configured or in stub mode. Payload:", name);
      return new Response(JSON.stringify({ success: true, stub: true, name }), { status: 200 });
    }

    const result = await inngest.send({ name, data });
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (err) {
    console.error("/api/inngest POST error:", err);
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 });
  }
}

export async function GET(req) {
  return new Response(JSON.stringify({ hello: "Inngest route active" }), { status: 200 });
}
