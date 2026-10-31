"use client";
// Accessible SEVA FIRST Home Screen with refined visual density, balanced sizing, and adaptive assist features

import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile";
import { buildProfile } from "@/lib/profileDefaults";
import { PageTitle, Card, BigButton } from "@/components/ui";

export default function HomePage() {
  const { profile, loaded, saveProfile, resetProfile } = useProfile();
  const [computedFontSize, setComputedFontSize] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateSize = () => {
      setComputedFontSize(window.getComputedStyle(document.documentElement).fontSize);
    };
    updateSize();
    const timer = setTimeout(updateSize, 50);
    return () => clearTimeout(timer);
  }, [profile]);

  if (!loaded) {
    return (
      <main className="mx-auto max-w-5xl p-6 sm:p-10">
        <div role="status" aria-live="polite" className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-lg font-bold">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const { mode, language, disabilities } = profile;
  const isHi = language === "hi";

  // Check which demo profile is currently active
  const isRameshActive = disabilities.includes("deaf") && disabilities.includes("speech");
  const isPriyaActive = disabilities.includes("blind") && disabilities.includes("motor");
  const isCognitiveActive = disabilities.includes("cognitive") && disabilities.length === 1;

  return (
    <main className="mx-auto max-w-5xl space-y-8 sm:space-y-9 p-4 sm:p-6 lg:p-8 animate-fade-up">
      {/* 1. Hero Section */}
      <section aria-label="Welcome">
        <PageTitle
          badge={isHi ? "समान अवसर • सुलभ तकनीक" : "Accessibility First PWA"}
          title={
            isHi
              ? "सेवा फ़र्स्ट (SEVA FIRST)"
              : "Welcome to SEVA FIRST"
          }
          subtitle={
            mode.simpleText
              ? (isHi ? "सुलभ शिक्षा, काम और बातचीत।" : "Accessible learning, employment, and real-time communication.")
              : (isHi
                  ? "एक ही ब्राउज़र-आधारित मंच जो आपकी ज़रूरतों के अनुसार खुद को ढाल लेता है — सीखने, काम करने और संवाद के लिए।"
                  : "One browser platform that adapts in real-time to your unique abilities for learning, career, and daily communication.")
          }
        />
      </section>

      {/* 2. Assistive Features Live Status (Dynamic Badges) */}
      <section aria-label="Active accessibility features" className="space-y-3">
        {mode.voice && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start sm:items-center gap-3 rounded-2xl border border-indigo-500/80 bg-indigo-500/10 p-3.5 sm:p-4 font-semibold text-foreground shadow-xs"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white">
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
              </span>
              🎙️
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-black tracking-tight leading-snug">
                {isHi ? "वॉइस नेविगेशन सक्रिय (Voice Control Ready)" : "Voice Commands Active"}
              </p>
              <p className="text-xs sm:text-sm text-foreground/80 font-normal leading-relaxed">
                {isHi
                  ? "माइक या शॉर्टकट से बोलें: 'Learn खोलो', 'Work खोलो', या 'Connect खोलो'।"
                  : "Speak naturally: Say 'Open Learn', 'Open Work', 'Open Connect', or 'Settings'."}
              </p>
            </div>
          </div>
        )}

        {mode.captions && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start sm:items-center gap-3 rounded-2xl border border-emerald-500/80 bg-emerald-500/10 p-3.5 sm:p-4 font-semibold text-foreground shadow-xs"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white">
              🦻
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-black tracking-tight leading-snug">
                {isHi ? "लाइव कैप्शन्स चालू (Captions Active)" : "Live Captions Enabled"}
              </p>
              <p className="text-xs sm:text-sm text-foreground/80 font-normal leading-relaxed">
                {isHi
                  ? "सभी ऑडियो व संवाद के लिए स्क्रीन पर टेक्स्ट सबटाइटल्स दिखाए जाएंगे।"
                  : "Real-time speech-to-text subtitles are enabled for seamless conversations."}
              </p>
            </div>
          </div>
        )}

        {mode.simpleText && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-purple-500/80 bg-purple-500/10 p-3.5 font-semibold text-foreground"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-lg text-white">
              🧠
            </div>
            <div className="space-y-0.5">
              <p className="text-sm sm:text-base font-bold">
                {isHi ? "सरल भाषा मोड (Simple Text Mode)" : "Distraction-Free Simple Text Mode"}
              </p>
              <p className="text-xs text-foreground/80 font-normal">
                {isHi
                  ? "अनावश्यक जानकारी छिपाई गई है ताकि समझना आसान हो।"
                  : "Secondary details hidden to reduce cognitive load and visual fatigue."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 3. Three Core Pillars (Grid Cards) */}
      <section aria-label="Main Services" className="grid gap-5 md:grid-cols-3">
        {/* Pillar 1: LEARN */}
        <Card
          as="section"
          icon="📚"
          accentColor="indigo"
          title={
            mode.simpleText
              ? (isHi ? "सीखें" : "Learn")
              : (isHi ? "सीखें और आगे बढ़ें" : "Learn & Upskill")
          }
          badge={isHi ? "कोर्सेज" : "Courses"}
          className="flex flex-col justify-between"
        >
          <p className="text-sm sm:text-base text-foreground/90 font-normal leading-relaxed">
            {isHi
              ? "साइन लैंग्वेज और स्क्रीन रीडर के अनुकूल व्यावहारिक डिजिटल कोर्सेज।"
              : "Practical digital courses with Indian Sign Language (ISL) & screen reader navigation."}
          </p>

          <div className="optional-detail pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm font-medium text-foreground/75 space-y-1.5">
            <p className="flex items-center gap-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold" aria-hidden="true">✓</span>
              <span>{isHi ? "3 सुलभ कोर्सेज उपलब्ध" : "3 accessible courses ready"}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold" aria-hidden="true">✓</span>
              <span>{isHi ? "निःशुल्क प्रमाणपत्र" : "Free completion certificate"}</span>
            </p>
          </div>

          <div className="pt-4 mt-auto">
            <BigButton href="/learn" variant="primary" className="w-full">
              {isHi ? "कोर्स देखें →" : "Explore Courses →"}
            </BigButton>
          </div>
        </Card>

        {/* Pillar 2: WORK */}
        <Card
          as="section"
          icon="💼"
          accentColor="emerald"
          title={
            mode.simpleText
              ? (isHi ? "नौकरियां" : "Jobs")
              : (isHi ? "समावेशी रोजगार" : "Inclusive Careers")
          }
          badge={isHi ? "रोजगार" : "Jobs"}
          className="flex flex-col justify-between"
        >
          <p className="text-sm sm:text-base text-foreground/90 font-normal leading-relaxed">
            {isHi
              ? "सत्यापित दिव्यांग-अनुकूल नौकरियां और सुलभ कार्यस्थल अवसर।"
              : "Verified disability-friendly job openings with assistive workplace accommodations."}
          </p>

          <div className="optional-detail pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm font-medium text-foreground/75 space-y-1.5">
            <p className="flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold" aria-hidden="true">✓</span>
              <span>{isHi ? "रिमोट व हाइब्रिड विकल्प" : "Remote & hybrid roles"}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold" aria-hidden="true">✓</span>
              <span>{isHi ? "सुलभ उपकरण उपलब्ध" : "Assistive tech provided"}</span>
            </p>
          </div>

          <div className="pt-4 mt-auto">
            <BigButton href="/work" variant="primary" className="w-full">
              {isHi ? "नौकरियां खोजें →" : "Find Jobs →"}
            </BigButton>
          </div>
        </Card>

        {/* Pillar 3: CONNECT */}
        <Card
          as="section"
          icon="💬"
          accentColor="amber"
          title={
            mode.simpleText
              ? (isHi ? "बातचीत" : "Connect")
              : (isHi ? "संवाद और सहायता" : "Connect & Assist")
          }
          badge={isHi ? "मदद" : "Assist"}
          className="flex flex-col justify-between"
        >
          <p className="text-sm sm:text-base text-foreground/90 font-normal leading-relaxed">
            {isHi
              ? "डॉक्टर, बैंक और सरकारी दफ्तरों में बातचीत के लिए AAC बोर्ड व लाइव कैप्शन्स।"
              : "Real-time communication with AAC picture board & speech-to-text for clinics & banks."}
          </p>

          <div className="optional-detail pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm font-medium text-foreground/75 space-y-1.5">
            <p className="flex items-center gap-1.5">
              <span className="text-amber-600 dark:text-amber-400 font-bold" aria-hidden="true">✓</span>
              <span>{isHi ? "AAC सिंबल बोर्ड (स्पीच)" : "AAC Picture Board with speech"}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="text-amber-600 dark:text-amber-400 font-bold" aria-hidden="true">✓</span>
              <span>{isHi ? "लाइव स्पीच-टू-टेक्स्ट" : "Live speech-to-text panel"}</span>
            </p>
          </div>

          <div className="pt-4 mt-auto">
            <BigButton href="/connect" variant="primary" className="w-full">
              {isHi ? "कनेक्ट खोलें →" : "Open Connect →"}
            </BigButton>
          </div>
        </Card>
      </section>

      {/* 4. Live Demo Presets Switcher */}
      <section
        aria-label="Demo and Evaluation Controls"
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-card p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-500"
            >
              ⚡
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                Demo Profile Switcher (Live Adaptive Engine)
              </h2>
              <p className="text-xs text-foreground/70 font-normal">
                Instantly transforms color palette, typography scale, assist badges, and simple text mode.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-current/15 bg-current/5 px-3 py-1 font-mono text-xs">
            <span className="text-foreground/70">Computed Font:</span>
            <span className="font-bold underline text-foreground">{computedFontSize || "reading..."}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <BigButton
            variant={isRameshActive ? "primary" : "secondary"}
            onClick={() => saveProfile(buildProfile(["deaf", "speech"], "hi"))}
            className="!min-h-[44px] !text-xs sm:!text-sm !px-3 !py-2 !justify-start"
          >
            <span className="text-base">🦻</span>
            <div className="text-left leading-tight">
              <span className="block font-bold">Ramesh</span>
              <span className="block text-[0.7rem] font-normal opacity-80">Deaf+Speech (Hindi)</span>
            </div>
          </BigButton>

          <BigButton
            variant={isPriyaActive ? "primary" : "secondary"}
            onClick={() => saveProfile(buildProfile(["blind", "motor"], "en"))}
            className="!min-h-[44px] !text-xs sm:!text-sm !px-3 !py-2 !justify-start"
          >
            <span className="text-base">👁️</span>
            <div className="text-left leading-tight">
              <span className="block font-bold">Priya</span>
              <span className="block text-[0.7rem] font-normal opacity-80">Blind+Motor (1.25x, Voice)</span>
            </div>
          </BigButton>

          <BigButton
            variant={isCognitiveActive ? "primary" : "secondary"}
            onClick={() => saveProfile(buildProfile(["cognitive"], "en"))}
            className="!min-h-[44px] !text-xs sm:!text-sm !px-3 !py-2 !justify-start"
          >
            <span className="text-base">🧠</span>
            <div className="text-left leading-tight">
              <span className="block font-bold">Cognitive</span>
              <span className="block text-[0.7rem] font-normal opacity-80">Simple Text Mode</span>
            </div>
          </BigButton>

          <BigButton
            variant="danger"
            onClick={resetProfile}
            className="!min-h-[44px] !text-xs sm:!text-sm !px-3 !py-2"
          >
            <span className="text-base">↺</span>
            <span>Reset Profile</span>
          </BigButton>
        </div>
      </section>
    </main>
  );
}