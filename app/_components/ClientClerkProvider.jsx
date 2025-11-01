"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function ClientClerkProvider({ children, ...props }) {
  // Forward any clerk props (publishableKey, etc.) from the server layout
  return (
    <ClerkProvider {...props} appearance={{ variables: { colorPrimary: "#2563eb" } }}>
      {children}
    </ClerkProvider>
  );
}