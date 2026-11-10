import { Suspense } from "react";
import { connection } from "next/server";
import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/dal";
import { BigButton } from "@/components/ui";

export const metadata = {
  title: "Profile & Accessibility Preferences — EKAK (एकक)",
  description:
    "Manage your personal profile, contact information, and assistive accessibility preferences on Ekak.",
};

async function ProfileContent() {
  // `connection()` signals that this component reads per-request data (cookies/session)
  // — required when cacheComponents:true is set in next.config to opt out of static prerender
  await connection();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-blue-500/30 bg-card p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10 text-4xl text-blue-600">
          👤
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-black text-foreground">Sign In to View Profile</h2>
          <p className="text-sm text-foreground/70">
            Sign in to manage your personal details, saved progress, and synchronized accessibility preferences across all your devices.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <BigButton href="/login" variant="primary">
            Sign In
          </BigButton>
          <BigButton href="/signup" variant="secondary">
            Create Account
          </BigButton>
        </div>
      </div>
    );
  }

  return <ProfileForm user={user} />;
}

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8 animate-fade-up">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-3xl border border-foreground/10 bg-card/60 p-12 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm font-bold text-foreground/70">Loading profile and preferences…</p>
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </main>
  );
}

