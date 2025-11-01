import { Inngest } from "inngest";

// Create a real Inngest client when an API/event key is provided.
// In development (no key), expose a safe stub so the app doesn't throw
// when calling `inngest.send(...)` or `inngest.createFunction(...)`.
let _inngest;

if (process.env.INNGEST_API_KEY || process.env.INNGEST_EVENT_KEY) {
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
            console.warn("[inngest stub] createFunction called for", opts ? .id || opts);
            // Return a function-like no-op value usable as an export.
            const placeholder = () => {
                console.warn("[inngest stub] invoked placeholder function for", opts ? .id || opts);
                return null;
            };
            // Attach the same id for debugging consistency
            placeholder.id = opts ? .id || "stub";
            return placeholder;
        },
    };
}

export const inngest = _inngest;