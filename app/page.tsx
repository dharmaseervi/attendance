"use client"

import { useUser } from "@clerk/nextjs";
import Dashboard from "./dashboard/page";
import { redirect } from "next/navigation";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser()
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // Use `isSignedIn` to protect the content
  if (!isSignedIn) {
    return redirect('/sign-in');
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Dashboard />
    </div>
  );
}
