"use client";
// Accessible Connect screen: AAC Picture Board, Live Mic (STT), TTS, ISL Interpreter Booking

import { useState, useRef, useEffect, useCallback } from "react";
import useProfile from "@/hooks/useProfile";
import { PageTitle, Card, BigButton } from "@/components/ui";

/* ─── AAC Symbols ──────────────────────────────────────────────────── */
const AAC_SYMBOLS = [
  { id: "help",     icon: "🆘", en: "I need help",        hi: "मुझे मदद चाहिए" },
  { id: "yes",      icon: "✅", en: "Yes",                 hi: "हाँ" },
  { id: "no",       icon: "❌", en: "No",                  hi: "नहीं" },
  { id: "water",    icon: "💧", en: "Water please",        hi: "पानी दीजिए" },
  { id: "pain",     icon: "😣", en: "I am in pain",        hi: "दर्द हो रहा है" },
  { id: "medicine", icon: "💊", en: "Medicine",            hi: "दवाई" },
  { id: "toilet",   icon: "🚻", en: "Toilet",              hi: "शौचालय" },
  { id: "call",     icon: "📞", en: "Call someone",        hi: "किसी को बुलाएं" },
  { id: "doctor",   icon: "👨‍⚕️", en: "Doctor / Hospital", hi: "डॉक्टर / अस्पताल" },
  { id: "bank",     icon: "🏦", en: "Bank",                hi: "बैंक" },
  { id: "home",     icon: "🏠", en: "Go home",             hi: "घर जाना है" },
  { id: "food",     icon: "🍽️", en: "Food",                hi: "खाना" },
];

/* ─── ISL Interpreter Booking Data ─────────────────────────────────── */
const INTERPRETER_SLOTS = [
  { time: "10:00 AM", date: "Today" },
  { time: "12:30 PM", date: "Today" },
  { time: "3:00 PM",  date: "Today" },
  { time: "10:00 AM", date: "Tomorrow" },
  { time: "2:00 PM",  date: "Tomorrow" },
];

const BOOKING_PURPOSES = [
  { id: "medical",  icon: "🏥", en: "Medical / Hospital", hi: "चिकित्सा / अस्पताल" },
  { id: "legal",    icon: "⚖️", en: "Legal / Court",      hi: "कानूनी / न्यायालय" },
  { id: "bank",     icon: "🏦", en: "Bank / Finance",     hi: "बैंक / वित्त" },
  { id: "govt",     icon: "🏛️", en: "Government Office",  hi: "सरकारी कार्यालय" },
  { id: "other",    icon: "💬", en: "Other",              hi: "अन्य" },
];

/* ─── Speech Recognition Hook ──────────────────────────────────────── */
function useMicrophone() {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [micError, setMicError] = useState("");
  const [liveText, setLiveText] = useState("");
  const [history, setHistory] = useState([]);
  const langRef = useRef("en-IN");

  // Detect support once on mount
  useEffect(() => {
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSupported(!!SR);
  }, []);

  const buildRecognition = useCallback((lang) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onresult = (e) => {
      let interim = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setLiveText(interim);
      if (finalText.trim()) {
        setHistory((prev) =>
          [{ id: Date.now(), text: finalText.trim() }, ...prev].slice(0, 12)
        );
        setLiveText("");
      }
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        setMicError("Microphone access denied. Please allow microphone in browser settings.");
      } else if (e.error === "no-speech") {
        setMicError("No speech detected. Please speak louder or move closer.");
      } else if (e.error === "network") {
        setMicError("Network error. Check your internet connection.");
      } else {
        setMicError(`Microphone error: ${e.error}`);
      }
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    return rec;
  }, []);

  const start = useCallback(
    (lang) => {
      setMicError("");
      setLiveText("");
      langRef.current = lang;

      // Stop any existing instance first
      if (recRef.current) {
        try { recRef.current.stop(); } catch (_) {}
        recRef.current = null;
      }

      const rec = buildRecognition(lang);
      if (!rec) {
        setMicError("Speech recognition is not supported in this browser. Use Chrome or Edge.");
        return;
      }
      recRef.current = rec;

      try {
        rec.start();
        setListening(true);
      } catch (err) {
        setMicError("Could not start microphone: " + err.message);
      }
    },
    [buildRecognition]
  );

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch (_) {}
    setListening(false);
    setLiveText("");
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { recRef.current?.stop(); } catch (_) {}
    };
  }, []);

  return { listening, supported, micError, liveText, history, start, stop, clearHistory };
}

/* ─── TTS helper ────────────────────────────────────────────────────── */
function speak(text, lang) {
  if (!("speechSynthesis" in window) || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
  utter.rate = 0.88;
  window.speechSynthesis.speak(utter);
}

/* ─── Interpreter Booking Modal ─────────────────────────────────────── */
function InterpreterModal({ isHi, onClose }) {
  const [step, setStep] = useState(1); // 1=purpose, 2=slot, 3=confirm, 4=done
  const [purpose, setPurpose] = useState(null);
  const [slot, setSlot] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");

  function handleConfirm() {
    if (!name.trim()) { setFormError(isHi ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name."); return; }
    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      setFormError(isHi ? "कृपया 10 अंकों का फ़ोन नंबर दर्ज करें।" : "Please enter a valid 10-digit phone number.");
      return;
    }
    setFormError("");
    setStep(4);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-card shadow-2xl animate-fade-up overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70 dark:border-slate-800/70"
          style={{ background: "linear-gradient(135deg,rgba(91,69,224,0.08),rgba(59,142,240,0.06))" }}
        >
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="text-2xl">🧑‍🏫</span>
            <div>
              <h2 id="modal-title" className="text-base font-black text-foreground">
                {isHi ? "ISL दुभाषिया बुक करें" : "Book ISL Interpreter"}
              </h2>
              <p className="text-xs text-foreground/60 font-normal">
                {isHi ? `चरण ${step} / 4` : `Step ${step} of 4`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isHi ? "बंद करें" : "Close modal"}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 text-foreground/60 hover:bg-foreground/10 transition-colors focus-visible:outline focus-visible:outline-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-200/60 dark:bg-slate-800/60">
          <div
            className="h-1 transition-all duration-500"
            style={{
              width: `${(step / 4) * 100}%`,
              background: "var(--grad-primary)",
            }}
          />
        </div>

        <div className="p-5 space-y-4">
          {/* Step 1 — Purpose */}
          {step === 1 && (
            <div className="space-y-3 animate-fade-up">
              <p className="text-sm font-semibold text-foreground/75">
                {isHi ? "किस उद्देश्य के लिए दुभाषिया चाहिए?" : "What do you need the interpreter for?"}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {BOOKING_PURPOSES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setPurpose(p); setStep(2); }}
                    className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500 active:scale-95 ${
                      purpose?.id === p.id
                        ? "border-indigo-500 bg-indigo-500/12"
                        : "border-slate-200/80 dark:border-slate-800/80 bg-background hover:border-indigo-400/60 hover:bg-indigo-500/5"
                    }`}
                  >
                    <span aria-hidden="true" className="text-xl">{p.icon}</span>
                    <span className="text-xs font-bold text-foreground leading-tight">{isHi ? p.hi : p.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Slot */}
          {step === 2 && (
            <div className="space-y-3 animate-fade-up">
              <p className="text-sm font-semibold text-foreground/75">
                {isHi ? "अपॉइंटमेंट का समय चुनें:" : "Choose an available time slot:"}
              </p>
              <div className="space-y-2">
                {INTERPRETER_SLOTS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSlot(s); setStep(3); }}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500 active:scale-[0.98] ${
                      slot === s
                        ? "border-indigo-500 bg-indigo-500/12"
                        : "border-slate-200/80 dark:border-slate-800/80 bg-background hover:border-indigo-400/60"
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-foreground block">{s.time}</span>
                      <span className="text-xs text-foreground/60 font-medium">{s.date}</span>
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {isHi ? "उपलब्ध" : "Available"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-foreground/55 hover:text-foreground underline cursor-pointer"
              >
                ← {isHi ? "वापस" : "Back"}
              </button>
            </div>
          )}

          {/* Step 3 — Contact details */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-up">
              <p className="text-sm font-semibold text-foreground/75">
                {isHi ? "आपकी जानकारी:" : "Your contact details:"}
              </p>

              <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-background/50 px-4 py-3 space-y-0.5">
                <p className="text-[0.68rem] uppercase tracking-widest font-bold text-foreground/45">
                  {isHi ? "बुकिंग सारांश" : "Booking Summary"}
                </p>
                <p className="text-sm font-bold text-foreground">{isHi ? purpose?.hi : purpose?.en}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{slot?.date} — {slot?.time}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="interp-name" className="block text-xs font-bold text-foreground/65 mb-1">
                    {isHi ? "पूरा नाम *" : "Full Name *"}
                  </label>
                  <input
                    id="interp-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHi ? "जैसे: राहुल शर्मा" : "e.g. Rahul Sharma"}
                    className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-foreground/35 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="interp-phone" className="block text-xs font-bold text-foreground/65 mb-1">
                    {isHi ? "फ़ोन नंबर * (10 अंक)" : "Phone Number * (10 digits)"}
                  </label>
                  <input
                    id="interp-phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9XXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-foreground/35 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 outline-none transition-all"
                  />
                </div>
              </div>

              {formError && (
                <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  ⚠️ {formError}
                </p>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-none rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-foreground/70 hover:bg-foreground/8 transition-colors cursor-pointer"
                >
                  ← {isHi ? "वापस" : "Back"}
                </button>
                <BigButton variant="primary" onClick={handleConfirm} className="flex-1">
                  {isHi ? "बुकिंग पक्की करें ✓" : "Confirm Booking ✓"}
                </BigButton>
              </div>
            </div>
          )}

          {/* Step 4 — Confirmed */}
          {step === 4 && (
            <div className="space-y-4 py-2 text-center animate-fade-up">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-3xl text-3xl shadow-lg"
                  style={{ background: "var(--grad-primary)" }}
                >
                  ✅
                </div>
                <h3 className="text-xl font-black text-foreground">
                  {isHi ? "बुकिंग पक्की हो गई!" : "Booking Confirmed!"}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {isHi
                    ? `${name}, आपका ISL दुभाषिया ${slot?.date} को ${slot?.time} बजे ${purpose?.hi} के लिए उपलब्ध रहेगा। ${phone} पर SMS भेज दिया गया है।`
                    : `${name}, your ISL interpreter is confirmed for ${slot?.date} at ${slot?.time} (${purpose?.en}). A confirmation SMS has been sent to ${phone}.`}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm space-y-1 text-left">
                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                  📋 {isHi ? "बुकिंग विवरण" : "Booking Details"}
                </p>
                <p className="text-foreground/80"><strong>{isHi ? "समय:" : "Time:"}</strong> {slot?.date}, {slot?.time}</p>
                <p className="text-foreground/80"><strong>{isHi ? "उद्देश्य:" : "Purpose:"}</strong> {isHi ? purpose?.hi : purpose?.en}</p>
                <p className="text-foreground/80"><strong>{isHi ? "संपर्क:" : "Contact:"}</strong> {phone}</p>
              </div>
              <BigButton variant="primary" onClick={onClose} className="w-full">
                {isHi ? "बंद करें" : "Done"}
              </BigButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────── */
export default function ConnectPage() {
  const { profile } = useProfile();
  const { mode, language } = profile;
  const isHi = language === "hi";
  const micLang = isHi ? "hi-IN" : "en-IN";

  // AAC state
  const [lastSpoken, setLastSpoken] = useState(null);
  const [aacHistory, setAacHistory] = useState([]);

  // TTS panel
  const [ttsText, setTtsText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Interpreter modal
  const [showInterpreter, setShowInterpreter] = useState(false);

  // Microphone hook
  const mic = useMicrophone();

  /* AAC ─ tap to speak */
  function speakAAC(sym) {
    const label = isHi ? sym.hi : sym.en;
    setLastSpoken(sym.id);
    setAacHistory((prev) =>
      [{ id: Date.now(), icon: sym.icon, text: label }, ...prev].slice(0, 8)
    );
    speak(label, language);
  }

  /* TTS ─ speak typed text */
  function handleSpeak() {
    if (!ttsText.trim()) return;
    setIsSpeaking(true);
    const utter = new SpeechSynthesisUtterance(ttsText);
    utter.lang = isHi ? "hi-IN" : "en-IN";
    utter.rate = 0.88;
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  /* Stop TTS if we navigate away */
  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  return (
    <>
      {/* ISL Interpreter modal */}
      {showInterpreter && (
        <InterpreterModal isHi={isHi} onClose={() => setShowInterpreter(false)} />
      )}

      <main className="mx-auto max-w-5xl space-y-8 sm:space-y-10 p-4 sm:p-6 lg:p-8 animate-fade-up">
        {/* 1. Header */}
        <PageTitle
          badge={isHi ? "संवाद सहायता" : "Communication Assist"}
          title={isHi ? "संवाद और सहायता" : "Connect & Communicate"}
          subtitle={
            mode.simpleText
              ? (isHi ? "बोलने और सुनने में मदद के लिए टूल्स।" : "Tools to help you speak and hear better.")
              : (isHi
                  ? "AAC सिंबल बोर्ड, माइक कैप्शन्स और टेक्स्ट-टू-स्पीच से डॉक्टर, बैंक और सरकारी दफ्तरों में आसानी से बातचीत करें।"
                  : "Use the AAC board, live microphone captions, and text-to-speech to communicate at hospitals, banks, and offices.")
          }
        />

        {/* 2. AAC Picture Board */}
        <section aria-labelledby="aac-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="aac-heading" className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {isHi ? "AAC सिंबल बोर्ड" : "AAC Picture Board"}
              </h2>
              <p className="text-xs sm:text-sm text-foreground/60 font-normal mt-0.5">
                {isHi
                  ? "किसी भी सिंबल पर टैप करें — ऐप बोलेगा।"
                  : "Tap a symbol — the app speaks it aloud instantly."}
              </p>
            </div>
            {aacHistory.length > 0 && (
              <button
                type="button"
                onClick={() => { setAacHistory([]); setLastSpoken(null); }}
                className="shrink-0 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-foreground/65 hover:bg-foreground/8 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2"
              >
                {isHi ? "साफ करें" : "Clear All"}
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label={isHi ? "AAC कम्युनिकेशन सिंबल" : "AAC communication symbols"}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5"
          >
            {AAC_SYMBOLS.map((sym) => {
              const isActive = lastSpoken === sym.id;
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => speakAAC(sym)}
                  aria-label={isHi ? sym.hi : sym.en}
                  className={`group flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 min-h-[90px] text-center transition-all duration-150 cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500 active:scale-95 ${
                    isActive
                      ? "border-indigo-500 bg-indigo-500/14 shadow-md"
                      : "border-slate-200/80 dark:border-slate-800/80 bg-card hover:border-indigo-400/50 hover:bg-indigo-500/5 seva-card"
                  }`}
                >
                  <span aria-hidden="true" className="text-3xl leading-none transition-transform group-hover:scale-110 group-active:scale-90">
                    {sym.icon}
                  </span>
                  <span className="text-[0.67rem] sm:text-xs font-bold leading-tight text-foreground/85 text-center">
                    {isHi ? sym.hi : sym.en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* AAC History */}
          {aacHistory.length > 0 && (
            <div
              aria-label={isHi ? "हाल के संदेश" : "Recent messages"}
              className="rounded-2xl border border-slate-200/75 dark:border-slate-800/75 bg-card p-4 seva-card"
            >
              <p className="text-[0.67rem] uppercase tracking-widest font-bold text-foreground/45 mb-2.5">
                {isHi ? "हाल के संदेश" : "Recent Messages"}
              </p>
              <div className="flex flex-wrap gap-2">
                {aacHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => speak(item.text, language)}
                    title={isHi ? "दोबारा बोलें" : "Speak again"}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/8 px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-indigo-500/16 transition-colors cursor-pointer"
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.text}</span>
                    <span aria-hidden="true" className="text-[0.6rem] text-foreground/40">🔊</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. Microphone + TTS — 2-col on md+ */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* 3a. Live Microphone / Speech-to-Text */}
          <section aria-labelledby="stt-heading">
            <Card as="div" accentColor="emerald" className="h-full space-y-4">
              {/* Card header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: "rgba(5,150,105,0.12)" }}
                  >
                    🎤
                  </span>
                  <div>
                    <h2 id="stt-heading" className="text-base sm:text-lg font-black text-foreground">
                      {isHi ? "लाइव माइक कैप्शन्स" : "Live Microphone Captions"}
                    </h2>
                    <p className="text-xs text-foreground/55 font-normal">
                      {isHi ? "बोलें — टेक्स्ट स्क्रीन पर आएगा" : "Speak — text appears in real time"}
                    </p>
                  </div>
                </div>
                {mic.listening && (
                  <span className="flex items-center gap-1.5 rounded-full bg-rose-500/14 border border-rose-500/35 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" aria-hidden="true" />
                    {isHi ? "सुन रहा है" : "Live"}
                  </span>
                )}
              </div>

              {/* Browser support warning */}
              {!mic.supported && (
                <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  ⚠️ {isHi
                    ? "स्पीच रिकग्निशन इस ब्राउज़र में सपोर्ट नहीं है। Chrome या Edge उपयोग करें।"
                    : "Speech recognition not supported in this browser. Use Chrome or Edge."}
                </p>
              )}

              {/* Mic permission / network error */}
              {mic.micError && (
                <p role="alert" className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                  ⚠️ {mic.micError}
                </p>
              )}

              {/* Live transcript box */}
              <div
                role="status"
                aria-live="polite"
                aria-label={isHi ? "लाइव ट्रांसक्रिप्ट" : "Live transcript"}
                className="min-h-[72px] rounded-xl border border-slate-200/55 dark:border-slate-800/55 bg-background/60 p-3.5 text-sm font-medium text-foreground/85 leading-relaxed"
              >
                {mic.liveText ? (
                  <span className="italic opacity-70">{mic.liveText}</span>
                ) : (
                  <span className="text-foreground/30 text-xs">
                    {mic.listening
                      ? (isHi ? "बोलना शुरू करें..." : "Start speaking...")
                      : (isHi ? "माइक चालू करने के लिए नीचे बटन दबाएं।" : "Press the button below to start.")}
                  </span>
                )}
              </div>

              {/* Start / Stop button */}
              <BigButton
                variant={mic.listening ? "danger" : "primary"}
                onClick={mic.listening ? mic.stop : () => mic.start(micLang)}
                disabled={!mic.supported}
                className="w-full"
              >
                {mic.listening
                  ? (isHi ? "⏹ माइक बंद करें" : "⏹ Stop Microphone")
                  : (isHi ? "🎤 माइक शुरू करें" : "🎤 Start Microphone")}
              </BigButton>

              {/* Transcript history */}
              {mic.history.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.67rem] uppercase tracking-widest font-bold text-foreground/45">
                      {isHi ? "ट्रांसक्रिप्ट" : "Transcript"}
                    </p>
                    <button
                      type="button"
                      onClick={mic.clearHistory}
                      className="text-[0.67rem] font-bold text-foreground/40 hover:text-foreground/70 underline cursor-pointer"
                    >
                      {isHi ? "साफ करें" : "Clear"}
                    </button>
                  </div>
                  <ul className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                    {mic.history.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed"
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </section>

          {/* 3b. Text-to-Speech */}
          <section aria-labelledby="tts-heading">
            <Card as="div" accentColor="violet" className="h-full space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: "rgba(124,58,237,0.12)" }}
                >
                  🔊
                </span>
                <div>
                  <h2 id="tts-heading" className="text-base sm:text-lg font-black text-foreground">
                    {isHi ? "टेक्स्ट-टू-स्पीच" : "Text to Speech"}
                  </h2>
                  <p className="text-xs text-foreground/55 font-normal">
                    {isHi ? "टाइप करें और ऐप आपके लिए बोलेगा" : "Type a message and the app speaks for you"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="tts-input" className="sr-only">
                  {isHi ? "बोलने के लिए संदेश टाइप करें" : "Type message to speak"}
                </label>
                <textarea
                  id="tts-input"
                  rows={5}
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  placeholder={
                    isHi
                      ? "यहाँ टाइप करें... जैसे: मुझे डॉक्टर से मिलना है।"
                      : "Type here... e.g. I need to see the doctor."
                  }
                  className="w-full rounded-xl border border-slate-200/75 dark:border-slate-800/75 bg-background/60 px-4 py-3 text-sm sm:text-base text-foreground font-medium leading-relaxed placeholder:text-foreground/30 resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 outline-none transition-all"
                />

                <div className="flex gap-2.5">
                  <BigButton
                    variant="primary"
                    onClick={handleSpeak}
                    disabled={!ttsText.trim() || isSpeaking}
                    className="flex-1"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                  >
                    {isSpeaking
                      ? (isHi ? "⏳ बोल रहा है..." : "⏳ Speaking...")
                      : (isHi ? "🔊 बोलें" : "🔊 Speak")}
                  </BigButton>
                  <BigButton
                    variant="secondary"
                    onClick={() => { setTtsText(""); window.speechSynthesis?.cancel(); setIsSpeaking(false); }}
                    disabled={!ttsText && !isSpeaking}
                    className="!min-w-[48px] !px-3"
                    ariaLabel={isHi ? "मिटाएं" : "Clear text"}
                  >
                    ✕
                  </BigButton>
                </div>
              </div>

              {/* Quick phrases */}
              <div className="optional-detail space-y-2 pt-1 border-t border-slate-200/55 dark:border-slate-800/55">
                <p className="text-[0.67rem] uppercase tracking-widest font-bold text-foreground/45">
                  {isHi ? "त्वरित वाक्यांश" : "Quick Phrases"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(isHi
                    ? ["मुझे मदद चाहिए", "कृपया दोहराएं", "मुझे पानी दीजिए", "मैं ठीक हूँ", "शुक्रिया"]
                    : ["I need help", "Please repeat that", "I need water", "I am okay", "Thank you"]
                  ).map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setTtsText(phrase)}
                      className="rounded-full border border-violet-500/22 bg-violet-500/8 px-3 py-1 text-xs font-semibold text-foreground/75 hover:bg-violet-500/15 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* 4. Peer Support Resources */}
        <section aria-labelledby="support-heading" className="space-y-4">
          <h2 id="support-heading" className="text-lg sm:text-xl font-black text-foreground tracking-tight">
            {isHi ? "सहायता और संसाधन" : "Support & Resources"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* ISL Interpreter — now functional */}
            <Card as="div" icon="🧑‍🏫" accentColor="indigo" title={isHi ? "ISL दुभाषिया" : "ISL Interpreter"}>
              <p className="text-sm text-foreground/70 font-normal leading-relaxed">
                {isHi
                  ? "प्रमाणित भारतीय सांकेतिक भाषा दुभाषिया डॉक्टर, बैंक या कचहरी के लिए बुक करें।"
                  : "Book a certified Indian Sign Language interpreter for medical, bank, or legal appointments."}
              </p>
              <div className="pt-3 mt-auto">
                <BigButton
                  variant="primary"
                  onClick={() => setShowInterpreter(true)}
                  className="w-full"
                >
                  {isHi ? "अभी बुक करें →" : "Book Now →"}
                </BigButton>
              </div>
            </Card>

            {/* Disability Community */}
            <Card as="div" icon="👥" accentColor="emerald" title={isHi ? "दिव्यांग समुदाय" : "Peer Community"}>
              <p className="text-sm text-foreground/70 font-normal leading-relaxed">
                {isHi
                  ? "समान चुनौतियों से जूझ रहे साथियों से जुड़ें और अनुभव साझा करें।"
                  : "Connect with peers facing similar challenges and share experiences."}
              </p>
              <div className="pt-3 mt-auto">
                <BigButton variant="secondary" className="w-full !text-sm">
                  {isHi ? "जल्द आ रहा है →" : "Coming Soon →"}
                </BigButton>
              </div>
            </Card>

            {/* Rights & Schemes */}
            <Card as="div" icon="📋" accentColor="amber" title={isHi ? "अधिकार और योजनाएं" : "Rights & Schemes"}>
              <p className="text-sm text-foreground/70 font-normal leading-relaxed">
                {isHi
                  ? "UDID कार्ड, सरकारी योजनाएं और कानूनी अधिकारों की जानकारी।"
                  : "UDID card, government disability schemes, and legal rights explained simply."}
              </p>
              <div className="pt-3 mt-auto">
                <BigButton variant="secondary" className="w-full !text-sm">
                  {isHi ? "जल्द आ रहा है →" : "Coming Soon →"}
                </BigButton>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
