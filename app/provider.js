// Server-safe Provider wrapper.
// Previously this file used client-only hooks (Clerk's useUser) and performed
// an axios POST on mount. That required this file to be a client component,
// which can create extra client chunks that sometimes fail to load at runtime.
// To avoid ChunkLoad errors during client navigation, keep this wrapper server-side
// and keep it simple. If you need to run client-only checks (like create-user),
// move that logic into a dedicated client component mounted where necessary.

export default function Provider({ children }) {
  return <div className="min-h-screen">{children}</div>;
}
