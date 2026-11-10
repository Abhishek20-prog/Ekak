"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { updateProfile } from "@/app/actions/profile";
import { logout } from "@/app/actions/auth";
import { applyPrefs } from "@/lib/a11y-client";
import { Card, BigButton } from "@/components/ui";
import ErrorSummary from "./ErrorSummary";

const FONT_SIZES = [
  { value: 100, label: "100% — Standard", desc: "Default readable size" },
  { value: 125, label: "125% — Large", desc: "Slightly enlarged for comfort" },
  { value: 150, label: "150% — Larger", desc: "High legibility" },
  { value: 175, label: "175% — Extra Large", desc: "Strong visual magnification" },
  { value: 200, label: "200% — Maximum", desc: "Highest magnification" },
];

const SPEEDS = [
  { value: 0.5, label: "0.5× — Slow" },
  { value: 0.75, label: "0.75× — Relaxed" },
  { value: 1, label: "1.0× — Normal Speed" },
  { value: 1.25, label: "1.25× — Brisk" },
  { value: 1.5, label: "1.5× — Fast" },
  { value: 2, label: "2.0× — Double Speed" },
];

const LABELS = {
  name: "Full Name",
  bio: "About You",
  location: "Location",
  locale: "Language",
  speechRate: "Speech Speed",
  fontScale: "Text Scale",
};

export default function ProfileForm({ user }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const errors = state?.errors ?? {};
  const v = state?.values ?? { name: user.name, ...user.profile };

  // Local state for interactive live preview
  const [selectedFontScale, setSelectedFontScale] = useState(Number(v.fontScale || 100));
  const [bioLength, setBioLength] = useState((v.bio || "").length);

  // Apply new display settings right away after a successful save.
  useEffect(() => {
    if (state?.ok) {
      applyPrefs(state.values);
    }
  }, [state]);

  const initials = (user.name || "User")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className="space-y-8">
      {/* 1. Profile Hero Identity Banner */}
      <section
        aria-label="User Profile Summary"
        className="relative overflow-hidden rounded-3xl hero-banner p-6 sm:p-8 space-y-6 border border-blue-600/20"
      >
        {/* Ambient decorative glows */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-amber-500/15 blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* User Avatar Circle */}
            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-2xl sm:text-3xl font-black text-white shadow-lg shadow-blue-700/30 border-2 border-white/20">
              <span>{initials}</span>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[0.65rem] text-white shadow-xs" title="Online & Verified">
                ✓
              </span>
            </div>

            {/* Name, Email, & Member Since */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {user.name}
                </h1>
                <span className="rounded-full bg-blue-600/15 border border-blue-600/25 px-2.5 py-0.5 text-[0.68rem] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Verified
                </span>
              </div>
              <p className="text-sm text-foreground/75 font-medium flex items-center gap-1.5">
                <span>📧</span>
                <span>{user.email}</span>
              </p>
              <p className="text-xs text-foreground/55 font-semibold">
                Member since {formattedDate}
              </p>
            </div>
          </div>

          {/* Quick Actions (Sign Out & Settings) */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-foreground/10">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-foreground/15 bg-card/80 px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-foreground/5 hover:border-blue-500 transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600"
            >
              <span>⚙️</span>
              <span>Display Settings</span>
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs sm:text-sm font-black text-rose-700 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-200 cursor-pointer shadow-xs focus-visible:outline focus-visible:outline-4 focus-visible:outline-rose-500 active:scale-95"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Status Pill Matrix */}
        <div className="relative pt-4 border-t border-foreground/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider mr-1">
            Active Setup:
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-blue-600/10 border border-blue-600/20 px-3 py-1 text-xs font-bold text-blue-800 dark:text-blue-300">
            🌐 {v.locale === "hi" ? "हिन्दी (Hindi)" : "English"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
            🔤 Text {v.fontScale || 100}%
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            🎙️ Speech {v.speechRate || 1}×
          </span>
          {v.highContrast && (
            <span className="inline-flex items-center gap-1 rounded-xl bg-yellow-400/15 border border-yellow-500/30 px-3 py-1 text-xs font-bold text-yellow-700 dark:text-yellow-300">
              🌓 High Contrast
            </span>
          )}
          {v.screenReaderOptimized && (
            <span className="inline-flex items-center gap-1 rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-bold text-purple-800 dark:text-purple-300">
              🔊 Screen Reader Ready
            </span>
          )}
        </div>
      </section>

      {/* 2. Interactive Profile & Accessibility Form */}
      <form action={action} noValidate className="space-y-8">
        <ErrorSummary state={state} labels={LABELS} />

        {/* Live Feedback Alert */}
        <div role="status" aria-live="polite">
          {state?.ok && (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/15 p-4 text-emerald-900 dark:text-emerald-200 shadow-md animate-fade-up">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white font-black">
                ✓
              </span>
              <div>
                <p className="font-extrabold text-base">{state.message || "Profile updated successfully!"}</p>
                <p className="text-xs opacity-85">All display and accessibility adjustments have been synchronized.</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card 1: Personal Profile Details */}
          <Card
            as="section"
            accentColor="blue"
            icon="👤"
            title="Personal Details"
            badge="Account Info"
            className="space-y-5"
          >
            <p className="text-xs sm:text-sm text-foreground/75 font-medium -mt-2">
              Update how you appear on the platform and your regional language settings.
            </p>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-black text-foreground">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45 pointer-events-none">
                  👤
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  defaultValue={v.name}
                  aria-invalid={errors.name ? true : undefined}
                  className="w-full rounded-2xl border-2 border-foreground/15 bg-background pl-10 pr-4 py-3 text-sm sm:text-base font-semibold text-foreground transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
                />
              </div>
              {errors.name && (
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  ⚠️ {errors.name[0]}
                </p>
              )}
            </div>

            {/* Email (Read Only with Lock) */}
            <div className="space-y-1.5 opacity-85">
              <div className="flex items-center justify-between">
                <label htmlFor="email-display" className="block text-sm font-black text-foreground">
                  Email Address
                </label>
                <span className="text-[0.68rem] font-bold text-foreground/50 uppercase tracking-wider">
                  🔒 Locked (Primary ID)
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none">
                  📧
                </span>
                <input
                  id="email-display"
                  type="email"
                  disabled
                  defaultValue={user.email}
                  className="w-full rounded-2xl border-2 border-foreground/10 bg-foreground/5 pl-10 pr-4 py-3 text-sm sm:text-base font-semibold text-foreground/70 cursor-not-allowed"
                />
              </div>
              <p className="text-[0.72rem] text-foreground/55">
                Your email is verified and securely linked to your profile database record.
              </p>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label htmlFor="location" className="block text-sm font-black text-foreground">
                Location (City / State)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45 pointer-events-none">
                  📍
                </span>
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. New Delhi, Delhi"
                  defaultValue={v.location || ""}
                  className="w-full rounded-2xl border-2 border-foreground/15 bg-background pl-10 pr-4 py-3 text-sm sm:text-base font-semibold text-foreground transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
                />
              </div>
              {errors.location && (
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  ⚠️ {errors.location[0]}
                </p>
              )}
            </div>

            {/* Language Selection */}
            <div className="space-y-1.5">
              <label htmlFor="locale" className="block text-sm font-black text-foreground">
                Preferred Interface Language
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45 pointer-events-none">
                  🌐
                </span>
                <select
                  id="locale"
                  name="locale"
                  defaultValue={v.locale || "en"}
                  className="w-full appearance-none rounded-2xl border-2 border-foreground/15 bg-background pl-10 pr-10 py-3 text-sm sm:text-base font-semibold text-foreground transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/20 cursor-pointer"
                >
                  <option value="en">English (India)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/45 text-xs">
                  ▼
                </span>
              </div>
              <p className="text-[0.72rem] text-foreground/55">
                Automatically adapts voice feedback, speech-to-text, and navigation cues.
              </p>
            </div>

            {/* About You / Bio */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="bio" className="block text-sm font-black text-foreground">
                  About You (Bio)
                </label>
                <span className={`text-[0.68rem] font-bold ${bioLength > 500 ? "text-rose-500" : "text-foreground/50"}`}>
                  {bioLength}/500 chars
                </span>
              </div>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={v.bio || ""}
                onChange={(e) => setBioLength(e.target.value.length)}
                placeholder="Share a short note about yourself, your career goals, or your learning path..."
                className="w-full rounded-2xl border-2 border-foreground/15 bg-background p-3.5 text-sm sm:text-base font-semibold text-foreground transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
              />
              {errors.bio && (
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  ⚠️ {errors.bio[0]}
                </p>
              )}
            </div>
          </Card>

          {/* Card 2: Accessibility & Assistive Features */}
          <Card
            as="section"
            accentColor="amber"
            icon="🎛️"
            title="Accessibility & Assistive UI"
            badge="Real-time"
            className="space-y-5"
          >
            <p className="text-xs sm:text-sm text-foreground/75 font-medium -mt-2">
              Fine-tune sensory, auditory, and visual accommodations to suit your preferences.
            </p>

            {/* Screen Reader Optimization */}
            <label className="group flex items-start gap-3.5 rounded-2xl border-2 border-foreground/12 bg-card p-4 transition-all hover:border-amber-500 hover:shadow-xs cursor-pointer">
              <input
                id="screenReaderOptimized"
                name="screenReaderOptimized"
                type="checkbox"
                defaultChecked={v.screenReaderOptimized}
                className="mt-0.5 h-5 w-5 rounded-md border-2 border-foreground/30 accent-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                  <span>🎙️</span>
                  <span>Screen Reader Optimized</span>
                </span>
                <span className="text-xs text-foreground/65 block leading-relaxed font-medium">
                  Disables distracting motion and optimizes ARIA live announcements for NVDA, JAWS, and TalkBack.
                </span>
              </div>
            </label>

            {/* Read Aloud Button */}
            <label className="group flex items-start gap-3.5 rounded-2xl border-2 border-foreground/12 bg-card p-4 transition-all hover:border-amber-500 hover:shadow-xs cursor-pointer">
              <input
                id="readAloudEnabled"
                name="readAloudEnabled"
                type="checkbox"
                defaultChecked={v.readAloudEnabled}
                className="mt-0.5 h-5 w-5 rounded-md border-2 border-foreground/30 accent-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                  <span>🔊</span>
                  <span>Enable &ldquo;Read This Page Aloud&rdquo;</span>
                </span>
                <span className="text-xs text-foreground/65 block leading-relaxed font-medium">
                  Displays a floating text-to-speech speaker button for listening instead of reading.
                </span>
              </div>
            </label>

            {/* Speech Rate */}
            <div className="space-y-1.5">
              <label htmlFor="speechRate" className="block text-sm font-black text-foreground">
                Speech Playback Speed
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45 pointer-events-none">
                  ⚡
                </span>
                <select
                  id="speechRate"
                  name="speechRate"
                  defaultValue={String(v.speechRate || 1)}
                  className="w-full appearance-none rounded-2xl border-2 border-foreground/15 bg-background pl-10 pr-10 py-3 text-sm sm:text-base font-semibold text-foreground transition-colors focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 cursor-pointer"
                >
                  {SPEEDS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/45 text-xs">
                  ▼
                </span>
              </div>
            </div>

            {/* Text Scale / Font Size with Live Preview Box */}
            <div className="space-y-2">
              <label htmlFor="fontScale" className="block text-sm font-black text-foreground">
                Text Magnification Scale
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45 pointer-events-none">
                  🔤
                </span>
                <select
                  id="fontScale"
                  name="fontScale"
                  value={selectedFontScale}
                  onChange={(e) => setSelectedFontScale(Number(e.target.value))}
                  className="w-full appearance-none rounded-2xl border-2 border-foreground/15 bg-background pl-10 pr-10 py-3 text-sm sm:text-base font-semibold text-foreground transition-colors focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 cursor-pointer"
                >
                  {FONT_SIZES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label} ({f.desc})
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/45 text-xs">
                  ▼
                </span>
              </div>

              {/* Optical Preview Box */}
              <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-3.5 space-y-1">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-foreground/50">
                  Live Text Size Preview ({selectedFontScale}%):
                </span>
                <p
                  style={{ fontSize: `${selectedFontScale}%` }}
                  className="font-bold text-foreground transition-all duration-200 leading-snug"
                >
                  Ekak — हर एक के लिए सुलभ डिजिटल दुनिया।
                </p>
              </div>
            </div>

            {/* Visual Contrast & Motion Toggles */}
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <label className="group flex items-start gap-3 rounded-2xl border-2 border-foreground/12 bg-card p-3.5 transition-all hover:border-amber-500 cursor-pointer">
                <input
                  id="highContrast"
                  name="highContrast"
                  type="checkbox"
                  defaultChecked={v.highContrast}
                  className="mt-0.5 h-5 w-5 rounded-md border-2 border-foreground/30 accent-amber-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-extrabold text-foreground flex items-center gap-1">
                    <span>🌓</span>
                    <span>High Contrast</span>
                  </span>
                  <span className="text-[0.7rem] text-foreground/60 block font-medium">
                    Black background, yellow text.
                  </span>
                </div>
              </label>

              <label className="group flex items-start gap-3 rounded-2xl border-2 border-foreground/12 bg-card p-3.5 transition-all hover:border-amber-500 cursor-pointer">
                <input
                  id="reducedMotion"
                  name="reducedMotion"
                  type="checkbox"
                  defaultChecked={v.reducedMotion}
                  className="mt-0.5 h-5 w-5 rounded-md border-2 border-foreground/30 accent-amber-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-extrabold text-foreground flex items-center gap-1">
                    <span>🎬</span>
                    <span>Reduce Motion</span>
                  </span>
                  <span className="text-[0.7rem] text-foreground/60 block font-medium">
                    Calms animations & flashes.
                  </span>
                </div>
              </label>
            </div>
          </Card>
        </div>

        {/* 3. Sticky Save Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border-2 border-blue-600/30 bg-card p-5 sm:p-6 shadow-xl">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="text-sm font-black text-foreground">
              Ready to save your profile updates?
            </p>
            <p className="text-xs text-foreground/65 font-medium">
              Changes apply instantly to your active session and persist across visits.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <BigButton
              type="submit"
              variant="primary"
              disabled={pending}
              className="!px-8 !py-3.5 w-full sm:w-auto"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving Changes…</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>💾</span>
                  <span>Save Profile</span>
                </span>
              )}
            </BigButton>
          </div>
        </div>
      </form>
    </div>
  );
}
