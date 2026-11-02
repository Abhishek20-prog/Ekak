"use client";
// Entry redirect: route user to /home if onboarded, else /onboarding

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useProfile from "@/hooks/useProfile";
import { EkakLogo } from "@/components/ui";

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
      <div role="status" aria-live="polite" className="flex flex-col items-center space-y-4">
        <EkakLogo size="lg" />
        <p className="text-sm font-semibold text-foreground/70">
          Loading accessible experience...
        </p>
      </div>
    </main>
  );
}
