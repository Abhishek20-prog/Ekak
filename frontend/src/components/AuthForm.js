"use client";

import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth";
import ErrorSummary from "./ErrorSummary";
import { Check, Field } from "./Field";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const [state, action, pending] = useActionState(isSignup ? signup : login, undefined);
  const errors = state?.errors ?? {};
  // Voice announcement helper for users without a screen reader
  const speak = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <form action={action} noValidate className="stack">
      <ErrorSummary state={state} labels={{ name: "Name", email: "Email", password: "Password" }} />

      {isSignup && (
        <Field id="name" onFocus={() => speak("Enter your full name")} label="Full name" required autoComplete="name"
          defaultValue={state?.values?.name} error={errors.name?.[0]} />
      )}
      <Field id="email" onFocus={() => speak("Enter your email address")} type="email" label="Email" required autoComplete="email" spellCheck={false}
        defaultValue={state?.values?.email} error={errors.email?.[0]} />
      <Field id="password" onFocus={() => speak("Enter your password, minimum eight characters")} type="password" label="Password" required
        autoComplete={isSignup ? "new-password" : "current-password"}
        hint={isSignup ? "At least 8 characters." : undefined} error={errors.password?.[0]} />

      {isSignup && (
        <Check id="screenReaderOptimized" label="I use a screen reader"
          hint="Optional. Turns off animations and the built-in read-aloud button. You can change this later in your profile."
          defaultChecked={state?.values?.screenReaderOptimized} />
      )}

      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {isSignup ? "Create account" : "Log in"}
        </button>
      </div>
      <p role="status" className="sr-only">
        {pending ? (isSignup ? "Creating your account, please wait." : "Logging in, please wait.") : ""}
      </p>
    </form>
  );
}
