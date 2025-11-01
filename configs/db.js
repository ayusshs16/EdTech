import { drizzle } from "drizzle-orm/neon-http";

// Use a server-only DATABASE_URL environment variable for secure DB access.
// Don't expose DB connection strings to the client. Make sure to set
// DATABASE_URL in your deployment/.env (not NEXT_PUBLIC_...)
const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING;

export const db = drizzle(connectionString);
