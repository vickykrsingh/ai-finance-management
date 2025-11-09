"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkProviderClient({ children }) {
  // This component intentionally runs only on the client (ssr: false)
  // so Clerk's client SDK won't be initialized during static prerender.
  return <ClerkProvider>{children}</ClerkProvider>;
}
