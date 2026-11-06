"use client";
// Accessible Settings screen for Ekak: live toggles for captions, voice, simple text, high contrast, font size scale (A-/A+), language switch, and reset

import Link from "next/link";
import useProfile from "@/hooks/useProfile";
import { PageTitle, Card, Toggle, BigButton } from "@/components/ui";

const DISABILITY_LABELS = {
  deaf: { icon: "🦻", en: "Deaf / Hard of hearing", hi: "सुनने में कठिनाई" },
  speech: { icon: "🗣️", en: "Speech difficulty", hi: "बोलने में कठिनाई" },
  blind: { icon: "👁️", en: "Blind / Low vision", hi: "देखने में कठिनाई" },
  motor: { icon: "✋", en: "Motor / Mobility", hi: "हाथ-पैर चलाने में कठिनाई" },
  cognitive: { icon: "🧠", en: "Cognitive / Learning", hi: "समझने-सीखने में कठिनाई" },
};

const FONT_SCALES = [
  { value: 1.0, labelEn: "1.0x Normal (16px)", labelHi: "1.0x सामान्य (16px)" },
  { value: 1.25, labelEn: "1.25x Large (20px)", labelHi: "1.25x बड़ा (20px)" },
  { value: 1.5, labelEn: "1.5x Extra Large (24px)", labelHi: "1.5x बहुत बड़ा (24px)" },
  { value: 1.75, labelEn: "1.75x Maximum (28px)", labelHi: "1.75x अधिकतम (28px)" },
];

export default function SettingsPage() {
  const { profile, loaded, saveProfile, updateMode, resetProfile } = useProfile();

  if (!loaded) {
    return (
      <main className="mx-auto max-w-4xl p-6 sm:p-10">
        <div role="status" aria-live="polite" className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" />
          <p className="text-lg font-bold">Loading settings...</p>
        </div>
      </main>
    );
  }

  const { mode, language, disabilities } = profile;
  const isHi = language === "hi";

  const handleFontDecrease = () => {
    const newScale = Math.max(1.0, +(mode.fontScale - 0.25).toFixed(2));
    updateMode({ fontScale: newScale });
  };

  const handleFontIncrease = () => {
    const newScale = Math.min(1.75, +(mode.fontScale + 0.25).toFixed(2));
    updateMode({ fontScale: newScale });
  };

  const handleLanguageChange = (newLang) => {
    saveProfile({ ...profile, language: newLang });
  };

  const currentScaleObj =
    FONT_SCALES.find((s) => Math.abs(s.value - mode.fontScale) < 0.05) || FONT_SCALES[0];

  return (
    <main className="mx-auto max-w-4xl space-y-8 sm:space-y-9 p-4 sm:p-6 lg:p-8 animate-fade-up">
      {/* 1. Header */}
      <PageTitle
        badge={isHi ? "अनुकूलन सेटिंग्स • एकाक" : "Personal Preferences • Ekak"}
        title={isHi ? "सुलभता सेटिंग्स (Settings)" : "Accessibility Settings"}
        subtitle={
          isHi
            ? "डिस्प्ले, सहायक टूल्स और भाषा को अपनी सुविधानुसार बदलें। सभी बदलाव तुरंत लागू होते हैं।"
            : "Customize visual appearance, assistive features, and language. Changes apply instantly across the whole app."
        }
      />

      {/* 2. Assistive Features Toggles */}
      <section aria-labelledby="assistive-toggles-heading" className="space-y-4">
        <div>
          <h2 id="assistive-toggles-heading" className="text-lg sm:text-xl font-black text-foreground tracking-tight">
            {isHi ? "सहायक सुविधाएं (Assistive Modes)" : "Assistive Modes"}
          </h2>
          <p className="text-xs sm:text-sm text-foreground/75 font-normal">
            {isHi
              ? "इन विकल्पों को चालू या बंद करके अपनी ज़रूरतों के अनुसार ऐप को कस्टमाइज़ करें।"
              : "Toggle features on or off. Everything adapts live without reloading."}
          </p>
        </div>

        <div className="grid gap-3">
          {/* Live Captions Toggle */}
          <Toggle
            id="toggle-captions"
            icon="🦻"
            label={isHi ? "लाइव कैप्शन्स (Live Captions)" : "Live Captions"}
            hint={
              isHi
                ? "ऑडियो, वीडियो और संवाद के लिए स्क्रीन पर टेक्स्ट सबटाइटल्स दिखाएं"
                : "Display real-time subtitles and visual transcripts for audio & speech"
            }
            checked={mode.captions}
            onChange={(val) => updateMode({ captions: val })}
          />

          {/* Voice Navigation Toggle */}
          <Toggle
            id="toggle-voice"
            icon="🎙️"
            label={isHi ? "वॉइस नेविगेशन (Voice Commands)" : "Voice Commands"}
            hint={
              isHi
                ? "बोलकर नेविगेट करें और स्क्रीन पर कमांड्स दें (माइक सपोर्ट)"
                : "Control the app using spoken voice commands and speech recognition"
            }
            checked={mode.voice}
            onChange={(val) => updateMode({ voice: val })}
          />

          {/* Simple Text Toggle */}
          <Toggle
            id="toggle-simple-text"
            icon="🧠"
            label={isHi ? "सरल भाषा मोड (Simple Text Mode)" : "Simple Text Mode"}
            hint={
              isHi
                ? "अनावश्यक विवरण छिपाएं और समझने में आसान शब्दों का उपयोग करें"
                : "Reduce cognitive clutter, simplify vocabulary, and expand line spacing"
            }
            checked={mode.simpleText}
            onChange={(val) => updateMode({ simpleText: val })}
          />

          {/* High Contrast Toggle */}
          <Toggle
            id="toggle-contrast"
            icon="👁️"
            label={isHi ? "हाई कंट्रास्ट मोड (High Contrast)" : "High Contrast Mode"}
            hint={
              isHi
                ? "अधिकतम दृश्यता के लिए शुद्ध काला बैकग्राउंड और पीला टेक्स्ट (WCAG AAA)"
                : "Pure black background and vivid yellow text for maximum readability (WCAG AAA)"
            }
            checked={mode.highContrast}
            onChange={(val) => updateMode({ highContrast: val })}
          />
        </div>
      </section>

      {/* 3. Font Size Control (A- / A+) */}
      <section aria-labelledby="font-scale-heading">
        <Card as="div" accentColor="blue" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-stone-200/80 dark:border-stone-800/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="text-2xl">🔤</span>
              <div>
                <h2 id="font-scale-heading" className="text-lg sm:text-xl font-black text-foreground">
                  {isHi ? "टेक्स्ट का आकार (Font Size)" : "Font Size Scale"}
                </h2>
                <p className="text-xs text-foreground/75 font-normal">
                  {isHi ? "पूरे ऐप के फॉन्ट साइज को बढ़ाएं या घटाएं" : "Scale interface typography from 1.0x to 1.75x"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-blue-600/30 bg-blue-600/10 px-3 py-1 font-bold text-xs sm:text-sm text-blue-800 dark:text-blue-300">
              {isHi ? currentScaleObj.labelHi : currentScaleObj.labelEn}
            </div>
          </div>

          {/* Interactive A- / A+ Control Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <BigButton
              variant="secondary"
              onClick={handleFontDecrease}
              disabled={mode.fontScale <= 1.0}
              ariaLabel="Decrease font size (A-)"
              className="flex-1 !min-h-[46px] text-sm sm:text-base"
            >
              <span className="font-bold opacity-75">A−</span>
              <span>{isHi ? "छोटा करें (Smaller)" : "Smaller (A−)"}</span>
            </BigButton>

            <BigButton
              variant="primary"
              onClick={handleFontIncrease}
              disabled={mode.fontScale >= 1.75}
              ariaLabel="Increase font size (A+)"
              className="flex-1 !min-h-[46px] text-sm sm:text-base"
            >
              <span className="text-lg font-black">A+</span>
              <span>{isHi ? "बड़ा करें (Larger)" : "Larger (A+)"}</span>
            </BigButton>
          </div>

          {/* Live Preview Sentence */}
          <div className="rounded-xl border border-current/15 bg-current/5 p-3.5 sm:p-4">
            <p className="text-[0.7rem] uppercase tracking-wider font-extrabold text-foreground/60 mb-0.5">
              {isHi ? "लाइव प्रीव्यू (Live Preview)" : "Live Text Preview"}
            </p>
            <p className="text-sm sm:text-base text-foreground font-normal leading-relaxed">
              {isHi
                ? "यह नमूना वाक्य दिखाता है कि फॉन्ट स्केल बदलने पर टेक्स्ट कैसा दिखता है। बटन और कार्ड्स भी इसके साथ सहज रूप से स्केल होते हैं।"
                : "This sample text demonstrates how typography dynamically adjusts when scaling font size. All cards, headings, and buttons scale proportionally."}
            </p>
          </div>
        </Card>
      </section>

      {/* 4. Language Selection */}
      <section aria-labelledby="language-heading">
        <Card as="div" accentColor="olive" className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-stone-200/80 dark:border-stone-800/80 pb-3.5">
            <span aria-hidden="true" className="text-2xl">🌐</span>
            <div>
              <h2 id="language-heading" className="text-lg sm:text-xl font-black text-foreground">
                {isHi ? "पसंदीदा भाषा (Language)" : "Preferred Language"}
              </h2>
              <p className="text-xs text-foreground/75 font-normal">
                {isHi ? "ऐप की भाषा चुनें (अंग्रेजी या हिंदी)" : "Choose language for interface text and voice recognition"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* English Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 ${
                language === "en"
                  ? "border-blue-700 bg-blue-700/10 text-foreground shadow-xs"
                  : "border-stone-200/90 dark:border-stone-800/90 hover:border-blue-600 bg-card"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl leading-none" aria-hidden="true">🌐</span>
                <div>
                  <span className="text-base font-bold block">English</span>
                  <span className="text-xs text-foreground/70 font-medium">Standard UI</span>
                </div>
              </div>
              {language === "en" && (
                <span className="rounded-full bg-blue-700 text-white px-2 py-0.5 text-xs font-bold">
                  ✓ Active
                </span>
              )}
            </button>

            {/* Hindi Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange("hi")}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 ${
                language === "hi"
                  ? "border-blue-700 bg-blue-700/10 text-foreground shadow-xs"
                  : "border-stone-200/90 dark:border-stone-800/90 hover:border-blue-600 bg-card"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl leading-none" aria-hidden="true">🇮🇳</span>
                <div>
                  <span className="text-base font-bold block">हिन्दी (Hindi)</span>
                  <span className="text-xs text-foreground/70 font-medium">हिंदी इंटरफ़ेस</span>
                </div>
              </div>
              {language === "hi" && (
                <span className="rounded-full bg-blue-700 text-white px-2 py-0.5 text-xs font-bold">
                  ✓ सक्रिय
                </span>
              )}
            </button>
          </div>
        </Card>
      </section>

      {/* 5. Active Disabilities & Profile Re-configuration */}
      <section aria-labelledby="disability-profile-heading">
        <Card as="div" accentColor="saffron" className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-stone-200/80 dark:border-stone-800/80 pb-3.5">
            <span aria-hidden="true" className="text-2xl">👤</span>
            <div>
              <h2 id="disability-profile-heading" className="text-lg sm:text-xl font-black text-foreground">
                {isHi ? "मेरी प्रोफ़ाइल (Disability Profile)" : "Active Disability Profile"}
              </h2>
              <p className="text-xs text-foreground/75 font-normal">
                {isHi ? "आपके द्वारा चुनी गई वर्तमान दिव्यांगता सेटिंग्स" : "Disabilities currently active in your personalized profile"}
              </p>
            </div>
          </div>

          {/* Active disability badges */}
          <div className="flex flex-wrap gap-2">
            {disabilities.length === 0 ? (
              <p className="text-xs sm:text-sm text-foreground/70 italic">
                {isHi ? "कोई दिव्यांगता नहीं चुनी गई है।" : "No specific disability profile selected."}
              </p>
            ) : (
              disabilities.map((d) => {
                const info = DISABILITY_LABELS[d] || { icon: "♿", en: d, hi: d };
                return (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-current/25 bg-current/5 px-3 py-1.5 text-xs sm:text-sm font-bold"
                  >
                    <span aria-hidden="true">{info.icon}</span>
                    <span>{isHi ? info.hi : info.en}</span>
                  </span>
                );
              })
            )}
          </div>

          <div className="pt-1">
            <Link
              href="/onboarding"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-background px-4 py-2 text-xs sm:text-sm font-bold text-foreground transition-all hover:bg-current/10 hover:border-current focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600"
            >
              <span aria-hidden="true">✏️</span>
              <span>{isHi ? "दिव्यांगता विकल्प बदलें (Re-configure)" : "Change My Disabilities (Re-onboard)"}</span>
            </Link>
          </div>
        </Card>
      </section>

      {/* 6. Danger Zone: Reset Profile */}
      <section aria-labelledby="reset-heading" className="rounded-2xl border border-rose-500/40 bg-rose-500/5 p-4 sm:p-5 space-y-3">
        <h2 id="reset-heading" className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
          {isHi ? "सेटिंग्स रीसेट करें (Reset All Settings)" : "Reset Application Settings"}
        </h2>
        <p className="text-xs sm:text-sm text-foreground/80 font-normal leading-relaxed">
          {isHi
            ? "सभी सहायक सेटिंग्स, फॉन्ट साइज और थीम को फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करें।"
            : "Restore all assistive modes, font size scaling, and themes back to the factory default state."}
        </p>
        <div>
          <BigButton
            variant="danger"
            onClick={resetProfile}
            className="!min-h-[44px] !text-xs sm:!text-sm !px-4 !py-2"
          >
            <span aria-hidden="true">↺</span>
            <span>{isHi ? "डिफ़ॉल्ट सेटिंग्स रीसेट करें" : "Reset to Default Settings"}</span>
          </BigButton>
        </div>
      </section>
    </main>
  );
}
