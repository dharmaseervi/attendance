"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    router.push("/sign-in"); // ✅ Instead of redirect()
    return null;
  }

  // redirect to dashboard after login
  router.push("/dashboard");
  return null;
}
