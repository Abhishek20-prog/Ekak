import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import ReadAloud from "@/components/ReadAloud";
import { getCurrentUser } from "@/lib/dal";

export const metadata = { title: "Create an account" };

async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect("/home");
  return null;
}

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-foreground">Create an account</h1>
        <ReadAloud />
      </div>
      <p className="text-sm text-foreground/70">
        Sign up to save your accessibility preferences across all your devices.
      </p>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <AuthForm mode="signup" />
      <p className="text-sm text-foreground/80 text-center pt-2">
        Already have an account? <Link href="/login" className="font-bold underline text-blue-600">Log in</Link>.
      </p>
    </div>
  );
}