import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Outfit } from "next/font/google";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";
import HeaderAuth from "./_components/HeaderAuth";

export const metadata = {
  title: "PrepGen — Where Preparation Meets Innovation",
  description:
    "PrepGen pairs intelligent study generation with modern tooling so learners prepare smarter, not harder.",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkProps = publishableKey ? { publishableKey } : {};

  if (!publishableKey) {
    console.warn(
      "[Clerk] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. ClerkProvider will rely on built-in detection."
    );
  }

  return (
    <ClerkProvider
      appearance={{ variables: { colorPrimary: "#2563eb" } }}
      {...clerkProps}
    >
      <html lang="en">
        <body className={outfit.className}>
          <HeaderAuth />
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
