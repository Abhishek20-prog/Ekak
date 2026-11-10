"use client";
// Accessible Onboarding Screen — Ekak brand, warm palette, robust multi-disability selection

import { useState } from "react";
import { useRouter } from "next/navigation";
import useProfile from "@/hooks/useProfile";
import { buildProfile } from "@/lib/profileDefaults";
import { PageTitle, BigButton, EkakLogo } from "@/components/ui";

const DISABILITIES = [
  { id: "deaf", icon: "🦻", label: "Deaf / Hard of hearing", hint: "सुनने में कठिनाई", assist: "Captions + Visual Indicators" },
  { id: "speech", icon: "🗣️", label: "Speech difficulty", hint: "बोलने में कठिनाई", assist: "AAC Board + Text to Speech" },
  { id: "blind", icon: "👁️", label: "Blind / Low vision", hint: "देखने में कठिनाई", assist: "Voice Control + High Contrast + 1.25x Font" },
  { id: "motor", icon: "✋", label: "Motor / Mobility", hint: "हाथ-पैर चलाने में कठिनाई", assist: "Voice Commands + Large Targets" },
  { id: "cognitive", icon: "🧠", label: "Cognitive / Learning", hint: "समझने-सीखने में कठिनाई", assist: "Simple Text Mode + Extra Spacing" },
];

const LANGUAGES = [
  { id: "en", label: "English", sublabel: "Standard UI & Voice" },
  { id: "hi", label: "हिन्दी (Hindi)", sublabel: "हिंदी इंटरफेस एवं हिंदी आवाज" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile } = useProfile();
  const [selected, setSelected] = useState([]);
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");

  
  function speakChoice(text) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  }
  function toggle(id) {
    setError("");
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selected.length === 0) {
      setError("Please select at least one option so Ekak can adapt to your needs.");
      return;
    }
    saveProfile(buildProfile(selected, language));
    router.push("/signup");
  }

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-8 lg:p-12 space-y-8 animate-fade-up">
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800/80 pb-5">
        <EkakLogo size="md" />
        <span className="text-xs font-bold px-3 py-1 rounded-full border border-blue-600/30 bg-blue-600/10 text-blue-800 dark:text-blue-300">
          Personalized Setup
        </span>
      </div>

      <PageTitle
        badge="Adaptive Accessibility"
        title="Welcome to Ekak (एकक)"
        subtitle="Tell us how you would like the interface to assist you. You can choose one or multiple options. Ekak adapts layout, typography, assistive speech, and colors in real-time."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
        {/* Disabilities multi-select */}
        <fieldset className="space-y-4">
          <legend className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            1. Which of these apply to you?
          </legend>
          <div className="flex flex-wrap items-center justify-between gap-2 -mt-2">
            <p className="text-sm text-foreground/75 font-medium">
              Select all that apply. Ekak seamlessly combines multiple assistive features.
            </p>
            {selected.length > 0 && (
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-600/10 px-2.5 py-1 rounded-lg">
                {selected.length} {selected.length === 1 ? "option" : "options"} selected
              </span>
            )}
          </div>

          <div
            role="group"
            aria-label="Disability options — select all that apply"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {DISABILITIES.map((d) => {
              const isChecked = selected.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  aria-label={`${d.label} — ${d.hint}`}
                  onClick={() => { toggle(d.id); speakChoice(selected.includes(d.id) ? `${d.label} deselected` : `${d.label} selected`); }}
                  className={`group relative flex min-h-[9rem] flex-col items-center justify-center gap-1.5 rounded-3xl border-2 p-5 text-center cursor-pointer transition-all duration-200
                    focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                    active:scale-95
                    ${isChecked
                      ? "border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-900/20"
                      : "border-stone-200/90 dark:border-stone-700/90 bg-card text-foreground hover:border-blue-600 hover:shadow-xs"
                    }`}
                >
                  <span className="text-4xl leading-none transition-transform group-hover:scale-110" aria-hidden="true">
                    {d.icon}
                  </span>
                  <span className="text-base sm:text-lg font-bold tracking-tight">
                    {d.label}
                  </span>
                  <span className={`text-xs sm:text-sm font-medium ${isChecked ? "text-blue-100" : "text-foreground/70"}`}>
                    {d.hint}
                  </span>
                  
                  {/* Adaptive preview badge */}
                  <span className={`text-[0.65rem] font-semibold mt-1 px-2 py-0.5 rounded-md ${
                    isChecked ? "bg-white/20 text-white" : "bg-stone-100 dark:bg-stone-800 text-foreground/60"
                  }`}>
                    {d.assist}
                  </span>

                  {isChecked && (
                    <span className="text-xs font-black tracking-wider uppercase mt-1 rounded-full px-2.5 py-0.5 border bg-white/20 border-white/60 text-white">
                      ✓ Selected
                    </span>
                  )}
                </button>
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
            Captions, Indian Sign Language tracks, and text-to-speech voice will automatically adapt.
          </p>

          <div
            role="radiogroup"
            aria-label="Language selection"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {LANGUAGES.map((l) => {
              const isChecked = language === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="radio"
                  aria-checked={isChecked}
                  onClick={() => setLanguage(l.id)}
                  className={`group relative flex min-h-[7.5rem] flex-col items-center justify-center gap-1 rounded-3xl border-2 p-5 text-center cursor-pointer transition-all duration-200
                    focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                    active:scale-95
                    ${isChecked
                      ? "border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-900/20"
                      : "border-stone-200/90 dark:border-stone-700/90 bg-card text-foreground hover:border-blue-600 hover:shadow-xs"
                    }`}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {l.id === "hi" ? "🇮🇳" : "🌐"}
                  </span>
                  <span className="text-lg font-bold tracking-tight">
                    {l.label}
                  </span>
                  <span className={`text-xs font-medium ${isChecked ? "text-blue-100" : "text-foreground/70"}`}>
                    {l.sublabel}
                  </span>
                  {isChecked && (
                    <span className="text-xs font-black tracking-wider uppercase mt-1 rounded-full px-2.5 py-0.5 border bg-white/20 border-white/60 text-white">
                      ✓ Active
                    </span>
                  )}
                </button>
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

        {/* About Ekak Concept Note */}
        <aside className="rounded-2xl border border-amber-600/30 bg-amber-600/5 p-4 sm:p-5 text-sm space-y-1">
          <p className="font-extrabold text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <span>💡</span>
            <span>What does &quot;Ekak&quot; (एकक) mean?</span>
          </p>
          <p className="text-foreground/80 leading-relaxed font-normal">
            In Sanskrit and Hindi, <strong>Ekak (एकक)</strong> signifies the <em>fundamental unit</em> — complete, whole, and dignified in itself. Ekak recognizes that every single individual with diverse abilities is an indispensable unit of our society.
          </p>
        </aside>

        {/* Submit */}
        <BigButton
          type="submit"
          variant="primary"
          className="w-full !py-4 !text-xl shadow-lg"
        >
          Continue to Ekak →
        </BigButton>
      </form>
    </main>
  );
}
