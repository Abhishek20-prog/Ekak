"use client";
// Attractive, Feature-Rich Ekak Home Dashboard — engaging visual cards, adaptive assist features, live demo presets

import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile";
import { buildProfile } from "@/lib/profileDefaults";
import { PageTitle, Card, BigButton, EkakLogo } from "@/components/ui";

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
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-teal-700 border-t-transparent" />
          <p className="text-lg font-bold">Loading Ekak dashboard...</p>
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
    <main className="mx-auto max-w-5xl space-y-9 p-4 sm:p-6 lg:p-8 animate-fade-up">
      {/* 1. Flagship Hero Banner */}
      <section aria-label="Welcome Banner" className="relative overflow-hidden rounded-3xl hero-banner p-6 sm:p-8 space-y-5">
        {/* Decorative corner glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-500/15 blur-2xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <EkakLogo size="lg" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-600/30 bg-teal-600/15 px-3.5 py-1 text-xs font-extrabold text-teal-900 dark:text-teal-200 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
              {isHi ? "अनुकूलन सक्रिय (Adaptive Mode ON)" : "Real-time Assistive UI"}
            </span>
            <span className="rounded-full border border-amber-600/30 bg-amber-600/15 px-3 py-1 text-xs font-extrabold text-amber-900 dark:text-amber-200">
              {isHi ? "🇮🇳 हिन्दी" : "🌐 English"}
            </span>
          </div>
        </div>

        <div className="relative space-y-2">
          <PageTitle
            badge={isHi ? "समान अवसर • स्वतंत्र जीवन" : "Inclusion • Dignity • Empowerment"}
            title={
              isHi
                ? "एकाक (Ekak) — सुलभ संवाद, शिक्षा एवं रोजगार"
                : "Welcome to Ekak (एकक)"
            }
            subtitle={
              mode.simpleText
                ? (isHi ? "सुलभ शिक्षा, समावेशी नौकरियां और बातचीत — हर एक व्यक्ति के लिए।" : "Accessible education, inclusive careers, and assistive communication for every one.")
                : (isHi
                    ? "एक ऐसा समावेशी ब्राउज़र मंच जो हर व्यक्ति की अनूठी क्षमताओं के अनुसार खुद को ढाल लेता है — सीखने, आजीविका और स्वतंत्र संवाद के लिए।"
                    : "An accessibility-first platform that adapts in real-time to your unique abilities for learning, career, and independent communication.")
            }
          />
        </div>

        {/* Quick Assist Launchpad Pills */}
        <div className="relative pt-2 border-t border-teal-600/20 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-extrabold text-foreground/70 uppercase tracking-wider">
            {isHi ? "त्वरित सुविधाएं:" : "Quick Access:"}
          </span>
          <BigButton href="/connect" variant="primary" className="!min-h-[40px] !py-2 !px-4 !text-xs !rounded-xl">
            💬 {isHi ? "AAC बोर्ड व हिंदी आवाज" : "AAC & Hindi Voice"}
          </BigButton>
          <BigButton href="/work" variant="secondary" className="!min-h-[40px] !py-2 !px-4 !text-xs !rounded-xl">
            💼 {isHi ? "सत्यापित नौकरियां" : "Inclusive Jobs"}
          </BigButton>
          <BigButton href="/learn" variant="secondary" className="!min-h-[40px] !py-2 !px-4 !text-xs !rounded-xl">
            📚 {isHi ? "ISL कोर्सेज" : "ISL Courses"}
          </BigButton>
          <BigButton href="/settings" variant="secondary" className="!min-h-[40px] !py-2 !px-4 !text-xs !rounded-xl">
            ⚙️ {isHi ? "फॉन्ट व डिस्प्ले" : "Adjust Display"}
          </BigButton>
        </div>
      </section>

      {/* 2. Assistive Features Live Status Badges */}
      <section aria-label="Active accessibility features" className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {mode.voice && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3.5 rounded-3xl border-2 border-amber-600/60 bg-gradient-to-br from-amber-600/15 to-amber-700/5 p-4 font-semibold text-foreground shadow-sm"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-700 text-xl text-white shadow-xs">
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              </span>
              🎙️
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-extrabold tracking-tight leading-snug">
                {isHi ? "वॉइस नेविगेशन सक्रिय" : "Voice Commands Active"}
              </p>
              <p className="text-xs text-foreground/75 font-medium leading-relaxed">
                {isHi
                  ? "बोलें: 'Learn खोलो', 'Work खोलो', या 'Connect खोलो'।"
                  : "Say: 'Open Learn', 'Open Work', 'Open Connect', or 'Settings'."}
              </p>
            </div>
          </div>
        )}

        {mode.captions && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3.5 rounded-3xl border-2 border-teal-600/60 bg-gradient-to-br from-teal-600/15 to-teal-700/5 p-4 font-semibold text-foreground shadow-sm"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-xl text-white shadow-xs">
              🦻
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-extrabold tracking-tight leading-snug">
                {isHi ? "लाइव कैप्शन्स चालू" : "Live Captions Enabled"}
              </p>
              <p className="text-xs text-foreground/75 font-medium leading-relaxed">
                {isHi
                  ? "सभी ऑडियो व संवाद के लिए स्क्रीन पर टेक्स्ट सबटाइटल्स सक्रिय हैं।"
                  : "Real-time speech-to-text subtitles are enabled."}
              </p>
            </div>
          </div>
        )}

        {mode.simpleText && (
          <div
            role="status"
            className="flex items-start gap-3.5 rounded-3xl border-2 border-purple-600/60 bg-gradient-to-br from-purple-600/15 to-purple-700/5 p-4 font-semibold text-foreground shadow-sm"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-700 text-xl text-white shadow-xs">
              🧠
            </div>
            <div className="space-y-0.5">
              <p className="text-base font-extrabold tracking-tight leading-snug">
                {isHi ? "सरल भाषा मोड" : "Simple Text Mode"}
              </p>
              <p className="text-xs text-foreground/75 font-medium leading-relaxed">
                {isHi
                  ? "अनावश्यक जटिलता हटा दी गई है ताकि समझना आसान हो।"
                  : "Secondary details hidden to reduce cognitive fatigue."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 3. Three Core Destination Cards */}
      <section aria-label="Main Services" className="grid gap-6 md:grid-cols-3">
        {/* Pillar 1: LEARN */}
        <Card
          as="section"
          icon="📚"
          accentColor="teal"
          title={
            mode.simpleText
              ? (isHi ? "सीखें (Learn)" : "Learn")
              : (isHi ? "सुलभ शिक्षा और कौशल" : "Learn & Upskill")
          }
          badge={isHi ? "3 सुलभ कोर्सेज" : "3 Ready Courses"}
          className="flex flex-col justify-between"
        >
          <p className="text-sm text-foreground/85 font-medium leading-relaxed">
            {isHi
              ? "भारतीय सांकेतिक भाषा (ISL), स्क्रीन रीडर और कैप्शन के साथ निःशुल्क डिजिटल कोर्सेज।"
              : "Practical digital courses with Indian Sign Language (ISL) tracks & screen reader navigation."}
          </p>

          <div className="optional-detail pt-3 border-t border-stone-200/80 dark:border-stone-800/80 text-xs font-semibold text-foreground/75 space-y-1.5">
            <p className="flex items-center gap-2">
              <span className="text-teal-700 dark:text-teal-400 font-extrabold text-sm" aria-hidden="true">✓</span>
              <span>{isHi ? "सांकेतिक भाषा वीडियो ट्रैक" : "ISL Sign Language Video Track"}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-teal-700 dark:text-teal-400 font-extrabold text-sm" aria-hidden="true">✓</span>
              <span>{isHi ? "निःशुल्क पूर्णता प्रमाण पत्र" : "Free completion certificate"}</span>
            </p>
          </div>

          <div className="pt-4 mt-auto">
            <BigButton href="/learn" variant="primary" className="w-full">
              {isHi ? "कोर्स शुरू करें →" : "Explore Courses →"}
            </BigButton>
          </div>
        </Card>

        {/* Pillar 2: WORK */}
        <Card
          as="section"
          icon="💼"
          accentColor="olive"
          title={
            mode.simpleText
              ? (isHi ? "नौकरियां (Jobs)" : "Jobs")
              : (isHi ? "समावेशी रोजगार मंच" : "Inclusive Careers")
          }
          badge={isHi ? "सत्यापित अवसर" : "Verified Jobs"}
          className="flex flex-col justify-between"
        >
          <p className="text-sm text-foreground/85 font-medium leading-relaxed">
            {isHi
              ? "दिव्यांग-हितैषी कंपनियों में नौकरियां जहां स्क्रीन रीडर, लचीले घंटे और सुलभ उपकरण मिलते हैं।"
              : "Verified employer openings offering assistive tech support, flexible hours, and accommodations."}
          </p>

          <div className="optional-detail pt-3 border-t border-stone-200/80 dark:border-stone-800/80 text-xs font-semibold text-foreground/75 space-y-1.5">
            <p className="flex items-center gap-2">
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm" aria-hidden="true">✓</span>
              <span>{isHi ? "रिमोट व हाइब्रिड विकल्प उपलब्ध" : "Remote & hybrid roles available"}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm" aria-hidden="true">✓</span>
              <span>{isHi ? "सुलभता सुविधाएं सत्यापित" : "Assistive accommodations verified"}</span>
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
          accentColor="saffron"
          title={
            mode.simpleText
              ? (isHi ? "संवाद (Connect)" : "Connect")
              : (isHi ? "संवाद और लाइव अनुवाद" : "Connect & Translate")
          }
          badge={isHi ? "लाइव हिंदी आवाज" : "Hindi Audio & Mic"}
          className="flex flex-col justify-between"
        >
          <p className="text-sm text-foreground/85 font-medium leading-relaxed">
            {isHi
              ? "AAC सिंबल बोर्ड, प्राकृतिक हिंदी आवाज, लाइव माइक और अनुवाद से किसी से भी बिना रुकावट बातचीत करें।"
              : "Communicate in hospitals, banks, and offices with AAC soundboard, native Hindi speech, and live translation."}
          </p>

          <div className="optional-detail pt-3 border-t border-stone-200/80 dark:border-stone-800/80 text-xs font-semibold text-foreground/75 space-y-1.5">
            <p className="flex items-center gap-2">
              <span className="text-amber-700 dark:text-amber-400 font-extrabold text-sm" aria-hidden="true">✓</span>
              <span>{isHi ? "AAC बोर्ड + प्राकृतिक हिंदी आवाज" : "AAC Board with Native Hindi Audio"}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-amber-700 dark:text-amber-400 font-extrabold text-sm" aria-hidden="true">✓</span>
              <span>{isHi ? "लाइव माइक व द्विदिशीय अनुवाद" : "Live mic & bidirectional translation"}</span>
            </p>
          </div>

          <div className="pt-4 mt-auto">
            <BigButton href="/connect" variant="primary" className="w-full">
              {isHi ? "कनेक्ट व अनुवाद खोलें →" : "Open Connect →"}
            </BigButton>
          </div>
        </Card>
      </section>

      {/* 4. Philosophy Card: Meaning of Ekak */}
      <section className="rounded-3xl border-2 border-stone-200/90 dark:border-stone-800/90 bg-card p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600/15 text-2xl text-teal-800 dark:text-teal-300">
            🌿
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              {isHi ? "एकाक (Ekak) का अर्थ एवं संकल्प" : "The Philosophy Behind Ekak (एकक)"}
            </h2>
            <p className="text-xs text-foreground/60 font-semibold">
              {isHi ? "हर एक व्यक्ति — पूर्ण, स्वतंत्र और सम्मानीय" : "Every single person — an indivisible, dignified unit"}
            </p>
          </div>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
          {isHi
            ? "संस्कृत व हिंदी में 'एकक' का अर्थ है — पूर्ण, अविभाज्य और अनूठी मौलिक इकाई (Fundamental Unit)। समाज में प्रत्येक दिव्यांग व्यक्ति एक पूर्ण और सम्मानीय इकाई है। एकाक का लक्ष्य तकनीक की बाधाओं को मिटाकर हर एक व्यक्ति को समानता और स्वाभिमान दिलाना है।"
            : "In Sanskrit, 'Ekak' signifies an indivisible, complete fundamental unit. In an inclusive society, every individual is an equal unit deserving autonomy, dignity, and access without barriers."}
        </p>
      </section>

      {/* 5. Live Demo Presets Switcher */}
      <section
        aria-label="Demo and Evaluation Controls"
        className="rounded-3xl border-2 border-stone-200/90 dark:border-stone-800/90 bg-card p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-600/15 text-2xl text-amber-700 dark:text-amber-400"
            >
              ⚡
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                Demo Profile Switcher (Live Adaptive Engine)
              </h2>
              <p className="text-xs text-foreground/70 font-medium">
                Instantly transforms typography scale, assist badges, colors, and simple text mode.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-current/20 bg-current/5 px-3.5 py-1.5 font-mono text-xs">
            <span className="text-foreground/70 font-semibold">Computed Font:</span>
            <span className="font-extrabold underline text-foreground">{computedFontSize || "reading..."}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <BigButton
            variant={isRameshActive ? "primary" : "secondary"}
            onClick={() => saveProfile(buildProfile(["deaf", "speech"], "hi"))}
            className="!min-h-[50px] !text-xs sm:!text-sm !px-3.5 !py-2.5 !justify-start !rounded-2xl"
          >
            <span className="text-xl">🦻</span>
            <div className="text-left leading-tight">
              <span className="block font-extrabold">Ramesh</span>
              <span className="block text-[0.7rem] font-semibold opacity-80">Deaf+Speech (Hindi)</span>
            </div>
          </BigButton>

          <BigButton
            variant={isPriyaActive ? "primary" : "secondary"}
            onClick={() => saveProfile(buildProfile(["blind", "motor"], "en"))}
            className="!min-h-[50px] !text-xs sm:!text-sm !px-3.5 !py-2.5 !justify-start !rounded-2xl"
          >
            <span className="text-xl">👁️</span>
            <div className="text-left leading-tight">
              <span className="block font-extrabold">Priya</span>
              <span className="block text-[0.7rem] font-semibold opacity-80">Blind+Motor (1.25x, Voice)</span>
            </div>
          </BigButton>

          <BigButton
            variant={isCognitiveActive ? "primary" : "secondary"}
            onClick={() => saveProfile(buildProfile(["cognitive"], "en"))}
            className="!min-h-[50px] !text-xs sm:!text-sm !px-3.5 !py-2.5 !justify-start !rounded-2xl"
          >
            <span className="text-xl">🧠</span>
            <div className="text-left leading-tight">
              <span className="block font-extrabold">Cognitive</span>
              <span className="block text-[0.7rem] font-semibold opacity-80">Simple Text Mode</span>
            </div>
          </BigButton>

          <BigButton
            variant="danger"
            onClick={resetProfile}
            className="!min-h-[50px] !text-xs sm:!text-sm !px-3.5 !py-2.5 !rounded-2xl"
          >
            <span className="text-xl">↺</span>
            <span className="font-extrabold">Reset Profile</span>
          </BigButton>
        </div>
      </section>
    </main>
  );
}
