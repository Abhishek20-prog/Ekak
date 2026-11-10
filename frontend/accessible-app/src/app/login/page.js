import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/dal";

export const metadata = { title: "Log in" };

async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect("/profile");
  return null;
}

export default function LoginPage() {
  return (
    <div className="stack max-w-prose">
      <h1>Log in</h1>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <AuthForm mode="login" />
      <p>New here? <Link href="/signup">Create an account</Link>.</p>
    </div>
  );
}
