'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export default function HeaderAuth() {
  const pathname = usePathname();

  // Landing page already includes its own auth buttons; avoid rendering duplicates there.
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-transparent border border-slate-200 px-4 py-2 rounded-full text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-5 hover:bg-[#5531d3] transition-colors">
            Sign up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  );
}
