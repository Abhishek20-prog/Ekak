"use client";
// Entry redirect: route user to /home if onboarded, else /onboarding

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useProfile from "@/hooks/useProfile";

export default function RootPage() {
  const router = useRouter();
  const { loaded, isOnboarded } = useProfile();

  useEffect(() => {
    if (!loaded) return;
    if (isOnboarded) {
      router.replace("/home");
    } else {
      router.replace("/onboarding");
    }
  }, [loaded, isOnboarded, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div role="status" aria-live="polite" className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">SEVA FIRST</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading accessible experience...
        </p>
      </div>
    </main>
  );
}
