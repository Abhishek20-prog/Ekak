import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/dal";

export const metadata = { title: "Create an account" };

async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect("/profile");
  return null;
}

export default function SignupPage() {
  return (
    <div className="stack max-w-prose">
      <h1>Create an account</h1>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <AuthForm mode="signup" />
      <p>Already have an account? <Link href="/login">Log in</Link>.</p>
    </div>
  );
}
