"use client";
// Accessible Onboarding Screen with modern selection cards, indigo gradient highlights, and error alerts

import { useState } from "react";
import { useRouter } from "next/navigation";
import useProfile from "@/hooks/useProfile";
import { buildProfile } from "@/lib/profileDefaults";
import { PageTitle, BigButton } from "@/components/ui";

const DISABILITIES = [
  { id: "deaf", icon: "🦻", label: "Deaf / Hard of hearing", hint: "सुनने में कठिनाई" },
  { id: "speech", icon: "🗣️", label: "Speech difficulty", hint: "बोलने में कठिनाई" },
  { id: "blind", icon: "👁️", label: "Blind / Low vision", hint: "देखने में कठिनाई" },
  { id: "motor", icon: "✋", label: "Motor / Mobility", hint: "हाथ-पैर चलाने में कठिनाई" },
  { id: "cognitive", icon: "🧠", label: "Cognitive / Learning", hint: "समझने-सीखने में कठिनाई" },
];

const LANGUAGES = [
  { id: "en", label: "English", sublabel: "Standard UI" },
  { id: "hi", label: "हिन्दी (Hindi)", sublabel: "हिंदी इंटरफेस" },
];

const cardBase =
  "group relative flex min-h-[8rem] flex-col items-center justify-center gap-1.5 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800/90 bg-card p-5 text-center cursor-pointer transition-all duration-200 " +
  "hover:border-indigo-400 hover:shadow-md active:scale-95 " +
  "peer-checked:bg-gradient-to-br peer-checked:from-indigo-600 peer-checked:to-blue-600 peer-checked:text-white peer-checked:border-indigo-600 peer-checked:shadow-lg peer-checked:shadow-indigo-500/25 " +
  "peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-500";

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile } = useProfile();
  const [selected, setSelected] = useState([]);
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");

  function toggle(id) {
    setError("");
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selected.length === 0) {
      setError("Please select at least one option so SEVA FIRST can adapt to your needs.");
      return;
    }
    saveProfile(buildProfile(selected, language));
    router.push("/home");
  }

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-8 lg:p-12 space-y-8">
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-2xl text-white shadow-md shadow-indigo-500/20"
        >
          🤝
        </span>
        <span className="text-2xl font-black tracking-tight text-foreground">
          SEVA <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">FIRST</span>
        </span>
      </div>

      <PageTitle
        badge="Personalized Setup"
        title="Welcome to SEVA FIRST"
        subtitle="Tell us how you would like the app to assist you. You can pick more than one option. The entire interface will adapt in real-time."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        {/* Disabilities multi-select */}
        <fieldset className="space-y-4">
          <legend className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            1. Which of these apply to you?
          </legend>
          <p className="text-sm text-foreground/75 font-medium -mt-2">
            Select all that apply. We support multiple combined disabilities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DISABILITIES.map((d) => {
              const isChecked = selected.includes(d.id);
              return (
                <label key={d.id} className="block">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isChecked}
                    onChange={() => toggle(d.id)}
                  />
                  <div className={cardBase}>
                    <span className="text-4xl leading-none transition-transform group-hover:scale-110" aria-hidden="true">
                      {d.icon}
                    </span>
                    <span className="text-base sm:text-lg font-bold tracking-tight">
                      {d.label}
                    </span>
                    <span className="text-xs sm:text-sm opacity-80 font-medium">
                      {d.hint}
                    </span>
                    <span className={`text-xs font-black tracking-wider uppercase mt-1 rounded-full px-2.5 py-0.5 border ${
                      isChecked
                        ? "bg-white/20 border-white text-white"
                        : "hidden"
                    }`}>
                      ✓ Selected
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Preferred language radio */}
        <fieldset className="space-y-4">
          <legend className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            2. Choose preferred language
          </legend>
          <p className="text-sm text-foreground/75 font-medium -mt-2">
            Text, captions, and speech commands will adapt to this language.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LANGUAGES.map((l) => {
              const isChecked = language === l.id;
              return (
                <label key={l.id} className="block">
                  <input
                    type="radio"
                    name="language"
                    className="peer sr-only"
                    value={l.id}
                    checked={isChecked}
                    onChange={() => setLanguage(l.id)}
                  />
                  <div className={cardBase}>
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {l.id === "hi" ? "🇮🇳" : "🌐"}
                    </span>
                    <span className="text-lg font-bold tracking-tight">
                      {l.label}
                    </span>
                    <span className="text-xs opacity-80 font-medium">
                      {l.sublabel}
                    </span>
                    <span className={`text-xs font-black tracking-wider uppercase mt-1 rounded-full px-2.5 py-0.5 border ${
                      isChecked
                        ? "bg-white/20 border-white text-white"
                        : "hidden"
                    }`}>
                      ✓ Selected
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-2xl border-2 border-rose-500 bg-rose-500/10 p-4 text-rose-600 dark:text-rose-400 font-bold"
          >
            <span aria-hidden="true" className="text-2xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <BigButton
          type="submit"
          variant="primary"
          className="w-full !py-4 !text-xl shadow-lg shadow-indigo-500/25"
        >
          Continue to SEVA FIRST →
        </BigButton>
      </form>
    </main>
  );
}