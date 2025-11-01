import { Inngest } from "inngest";

// Create a real Inngest client when an API/event key is provided.
// In development (no key), expose a safe stub so the app doesn't throw
// when calling `inngest.send(...)` or `inngest.createFunction(...)`.
let _inngest;

// For local development, prefer the lightweight stub even if an event key is set
// so developers can test without sending real events. If you want to force the
// real client locally, set FORCE_INNGEST=true in your env.
const isLocalHost = (process.env.HOST_URL || "").includes("localhost") || process.env.NODE_ENV === "development";
if ((process.env.INNGEST_API_KEY || process.env.INNGEST_EVENT_KEY) && !isLocalHost && process.env.FORCE_INNGEST !== "true") {
    _inngest = new Inngest({ id: "ai-study-material-gen" });
} else {
    // Lightweight stub for local development when no Inngest keys are present.
    _inngest = {
        send: async(payload) => {
            // Log and noop so dev flow continues without remote Inngest configured.
            // Keep the shape similar to the real client (returns an object with ids).
            console.warn("[inngest stub] send skipped (no INNGEST key). Payload:", payload ? .name);
            return { ids: [] };
        },
        createFunction: (opts, event, fn) => {
            // Return a harmless placeholder so imports that export created functions
            // don't break. The real runtime behavior (steps, step.run etc.) won't run
            // in stub mode.
            try {
                console.warn("[inngest stub] createFunction called for", (opts && opts.id) || opts);
            } catch (e) {}

            // Build a placeholder function-like object with a getConfig method
            const placeholder = function placeholderFunc() {
                console.warn("[inngest stub] invoked placeholder function for", (opts && opts.id) || opts);
                return null;
            };

            // Attach the same id for debugging consistency
            placeholder.id = (opts && opts.id) || "stub";

            // Provide getConfig so server-side helpers like `serve()` can read config
            placeholder.getConfig = () => {
                return {
                    id: (opts && opts.id) || "stub",
                    event: event || (opts && opts.event) || null,
                    // keep original opts for inspection
                    opts: opts || {},
                };
            };

            // Some consumers may check `.displayName` or `.id`. Avoid assigning
            // to the read-only `Function.name` property which may throw in
            // certain JS runtimes (edge). Use `displayName` instead.
            try {
                placeholder.displayName = placeholder.id;
            } catch (e) {
                // ignore; non-critical
            }

            return placeholder;
        },
    };
}

export const inngest = _inngest;