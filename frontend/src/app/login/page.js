import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import AuthForm from "@/components/AuthForm";
import ReadAloud from "@/components/ReadAloud";
import { getCurrentUser } from "@/lib/dal";

export const metadata = { title: "Log in" };

async function RedirectIfSignedIn() {
  await connection();
  if (await getCurrentUser()) redirect("/home");
  return null;
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-foreground">Log in</h1>
        <ReadAloud />
      </div>
      <p className="text-sm text-foreground/70">
        Enter your email and password to log in to your Ekak account.
      </p>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <AuthForm mode="login" />
      <p className="text-sm text-foreground/80 text-center pt-2">
        New here? <Link href="/signup" className="font-bold underline text-blue-600">Create an account</Link>.
      </p>
    </div>
  );
}