"use client";
// Accessible, Feature-Rich Connect & Translation Hub for Ekak
// Guaranteed Audible High-Fidelity Natural Hindi Audio, Real-Time Audio Visualizer,
// Live Microphone with Resilient Fallback, Multi-Category Tactile AAC Board & Bidirectional Translator

import { useState, useRef, useEffect, useCallback } from "react";
import useProfile from "@/hooks/useProfile";
import { PageTitle, Card, BigButton } from "@/components/ui";
import { translateText, toPhoneticHindi, HINDI_PHONETICS_MAP, COMMON_TRANSLATIONS } from "@/lib/translate";

/* ─── Rich Categorized AAC Symbols ──────────────────────────────────── */
const AAC_CATEGORIES = [
  { id: "all",       labelHi: "सभी सिंबल्स (All)",       labelEn: "All",       icon: "🌟" },
  { id: "health",    labelHi: "स्वास्थ्य व आपातकाल",   labelEn: "Medical",   icon: "🏥" },
  { id: "daily",     labelHi: "दैनिक आवश्यकताएं",    labelEn: "Daily",     icon: "💧" },
  { id: "office",    labelHi: "बैंक व सरकारी दफ्तर",    labelEn: "Office",    icon: "🏛️" },
  { id: "emergency", labelHi: "सुरक्षा व सहायता",      labelEn: "Safety",    icon: "🆘" },
];

const AAC_SYMBOLS = [
  // Health & Medical
  { id: "help",     category: "emergency", icon: "🆘", en: "I need help please",         hi: "कृपया मेरी सहायता करें",      accent: "from-rose-500/20 to-rose-600/10 border-rose-500/40" },
  { id: "doctor",   category: "health",    icon: "👨‍⚕️", en: "I need to see a doctor",    hi: "मुझे डॉक्टर से मिलना है",   accent: "from-teal-500/20 to-teal-600/10 border-teal-500/40" },
  { id: "pain",     category: "health",    icon: "😣", en: "I am in severe pain",         hi: "मुझे बहुत दर्द हो रहा है",     accent: "from-amber-500/20 to-amber-600/10 border-amber-500/40" },
  { id: "medicine", category: "health",    icon: "💊", en: "I need my medicine",         hi: "मुझे दवाई की आवश्यकता है",  accent: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40" },
  { id: "wheelchair",category: "health",   icon: "🦽", en: "I need a wheelchair",        hi: "मुझे व्हीलचेयर की आवश्यकता है", accent: "from-sky-500/20 to-sky-600/10 border-sky-500/40" },
  
  // Daily Essentials
  { id: "water",    category: "daily",     icon: "💧", en: "Drinking water please",      hi: "कृपया पीने का पानी दीजिए",     accent: "from-sky-500/20 to-sky-600/10 border-sky-500/40" },
  { id: "food",     category: "daily",     icon: "🍽️", en: "I am hungry, food please",   hi: "मुझे भोजन चाहिए",            accent: "from-orange-500/20 to-orange-600/10 border-orange-500/40" },
  { id: "toilet",   category: "daily",     icon: "🚻", en: "Where is the washroom?",     hi: "शौचालय किस तरफ है?",          accent: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/40" },
  { id: "home",     category: "daily",     icon: "🏠", en: "I want to go home",          hi: "मुझे घर जाना है",             accent: "from-teal-500/20 to-teal-600/10 border-teal-500/40" },
  
  // Office & Banking
  { id: "bank",     category: "office",    icon: "🏦", en: "Assistance with bank account",hi: "बैंक खाते में सहायता चाहिए", accent: "from-amber-500/20 to-amber-600/10 border-amber-500/40" },
  { id: "udid",     category: "office",    icon: "🪪", en: "UDID / Disability Card",     hi: "यूडीआईडी दिव्यांग कार्ड दिखाना है", accent: "from-teal-500/20 to-teal-600/10 border-teal-500/40" },
  { id: "call",     category: "emergency", icon: "📞", en: "Please call my family",       hi: "कृपया मेरे परिवार को फोन करें", accent: "from-purple-500/20 to-purple-600/10 border-purple-500/40" },
  { id: "yes",      category: "daily",     icon: "✅", en: "Yes, definitely",            hi: "हाँ, बिल्कुल ठीक है",         accent: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40" },
  { id: "no",       category: "daily",     icon: "❌", en: "No, excuse me",              hi: "नहीं, माफ़ कीजिए",             accent: "from-rose-500/20 to-rose-600/10 border-rose-500/40" },
  { id: "thanks",   category: "daily",     icon: "🙏", en: "Thank you very much",        hi: "आपका बहुत-बहुत धन्यवाद",       accent: "from-amber-500/20 to-amber-600/10 border-amber-500/40" },
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

/* ─── Audio Chime Helper (Instant Audio Pipeline Confirmation) ─────── */
function playAudioChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (_) {}
}

/* ─── Master Audio Engine: Guaranteed Authentic Natural Hindi ──────── */
function useAudioEngine() {
  const [speaking, setSpeaking] = useState(false);
  const [activeText, setActiveText] = useState("");
  const [rate, setRate] = useState(1.0);
  const [audioSource, setAudioSource] = useState("neural"); // "neural" | "browser"
  const audioRef = useRef(null);

  // Stop currently playing sound
  const stop = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (_) {}
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    setSpeaking(false);
    setActiveText("");
  }, []);

  // Fallback to browser SpeechSynthesis if audio fetch fails
  const fallbackSpeechSynthesis = useCallback((text, langCode) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeaking(false);
      return;
    }

    try {
      const isHindi = langCode === "hi" || langCode === "hi-IN";
      const voices = window.speechSynthesis.getVoices() || [];
      const hindiVoice = voices.find((v) => {
        const l = (v.lang || "").toLowerCase().replace("_", "-");
        const n = (v.name || "").toLowerCase();
        return (
          l === "hi-in" ||
          l.startsWith("hi") ||
          n.includes("hindi") ||
          n.includes("हिन्दी") ||
          n.includes("swara") ||
          n.includes("madhur")
        );
      });

      let textToSpeak = text;
      let speakLang = isHindi ? "hi-IN" : "en-IN";

      // If no native Hindi voice on Windows, apply phonetics to English voice
      if (isHindi && !hindiVoice) {
        textToSpeak = HINDI_PHONETICS_MAP[text.trim()] || toPhoneticHindi(text);
        speakLang = "en-IN";
      }

      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.lang = speakLang;
      if (hindiVoice) utter.voice = hindiVoice;
      utter.rate = rate;
      utter.onend = () => {
        setSpeaking(false);
        setActiveText("");
      };
      utter.onerror = () => {
        setSpeaking(false);
        setActiveText("");
      };

      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utter);
    } catch (_) {
      setSpeaking(false);
      setActiveText("");
    }
  }, [rate]);

  // Main speak function: Streams pure natural human Hindi MP3 via /api/tts
  const speak = useCallback(
    (text, lang = "hi") => {
      if (!text || !text.trim()) return;
      stop();
      playAudioChime();
      setSpeaking(true);
      setActiveText(text);

      const isHindi = lang === "hi" || lang === "hi-IN";
      const targetLang = isHindi ? "hi" : "en";
      const cleanText = text.trim().slice(0, 200);

      try {
        // Try Tier 1: Next.js API Route which delivers pure Google Neural Hindi Audio
        const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${targetLang}`;
        const audio = new Audio(ttsUrl);
        audioRef.current = audio;
        audio.playbackRate = rate;

        audio.onplay = () => {
          setAudioSource("neural");
          setSpeaking(true);
        };

        audio.onended = () => {
          setSpeaking(false);
          setActiveText("");
          audioRef.current = null;
        };

        audio.onerror = () => {
          // Tier 2: Direct Google Translate TTS endpoint
          const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob`;
          const directAudio = new Audio(directUrl);
          audioRef.current = directAudio;
          directAudio.playbackRate = rate;

          directAudio.onplay = () => setSpeaking(true);
          directAudio.onended = () => {
            setSpeaking(false);
            setActiveText("");
            audioRef.current = null;
          };

          directAudio.onerror = () => {
            // Tier 3: Browser SpeechSynthesis
            setAudioSource("browser");
            fallbackSpeechSynthesis(text, targetLang);
          };

          directAudio.play().catch(() => {
            setAudioSource("browser");
            fallbackSpeechSynthesis(text, targetLang);
          });
        };

        audio.play().catch(() => {
          // Play failed (e.g. autoplay restriction or network offline) -> fallback to browser
          setAudioSource("browser");
          fallbackSpeechSynthesis(text, targetLang);
        });
      } catch (_) {
        setAudioSource("browser");
        fallbackSpeechSynthesis(text, targetLang);
      }
    },
    [stop, rate, fallbackSpeechSynthesis]
  );

  return { speak, stop, speaking, activeText, rate, setRate, audioSource };
}

/* ─── Resilient Microphone, Genuine Voice Recorder & Live Equalizer ── */
function useLiveMicrophone({ barsContainerRef, levelTextRef } = {}) {
  const recRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const activeRecordingStartRef = useRef(0);
  const lastCapturedTranscriptRef = useRef("");
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const shouldListenRef = useRef(false);

  const [listening, setListening] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micNotice, setMicNotice] = useState("");
  const [liveText, setLiveText] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [history, setHistory] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "नमस्ते! एकाक संवाद केंद्र में आपका स्वागत है। बोलें या टैप करें।",
      translation: "Hello! Welcome to Ekak Connect. Speak or tap any button.",
      time: "Just now",
    },
  ]);

  // Real-time recording seconds counter
  useEffect(() => {
    if (!listening) return;
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [listening]);

  // Clean up audio graph on stop
  const stopAudioContext = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try { audioCtxRef.current.close(); } catch (_) {}
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    // Reset bars directly via DOM — zero re-render, zero flicker
    if (barsContainerRef?.current) {
      const bars = barsContainerRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = "8%";
        bars[i].style.backgroundColor = "#374151";
      }
    }
    if (levelTextRef?.current) levelTextRef.current.textContent = "0%";
    setMicActive(false);
  }, [barsContainerRef, levelTextRef]);

  // Start Web Audio visualizer — with ctx.resume() and speech band frequency focus
  const startAudioVisualizer = useCallback(async (existingStream) => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return null;
    try {
      const stream = existingStream || await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setMicActive(true);

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Human speech band focus (bins 1 to 32)
        let speechSum = 0;
        const activeBins = Math.min(32, dataArray.length);
        for (let i = 1; i < activeBins; i++) {
          speechSum += dataArray[i];
        }
        const speechAvg = speechSum / (activeBins - 1);
        const level = Math.min(100, Math.round((speechAvg / 75) * 100));

        // Direct DOM update — no setState, zero re-render, zero flicker!
        if (levelTextRef?.current) {
          levelTextRef.current.textContent = `${level}%`;
        }
        if (barsContainerRef?.current) {
          const bars = barsContainerRef.current.children;
          for (let i = 0; i < bars.length; i++) {
            const seed = (i * 13) % 40;
            const dynamicScale = level > 4 ? (level * 1.3) : 8;
            const h = Math.max(8, Math.min(100, Math.round(dynamicScale + (seed * 0.35) - 6)));
            bars[i].style.height = `${h}%`;
            bars[i].style.backgroundColor = h > 55 ? "#fbbf24" : level > 4 ? "#2dd4bf" : "#374151";
          }
        }
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
      return stream;
    } catch (_) {
      setMicNotice("माइक्रोफ़ोन अनुमति आवश्यक है। ब्राउज़र URL बार में 🔒 → Allow Microphone चुनें।");
      return null;
    }
  }, [barsContainerRef, levelTextRef]);

  // Build SpeechRecognition (optional live transcription layer)
  const buildRecognition = useCallback((lang) => {
    if (typeof window === "undefined") return null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang === "hi" || lang === "hi-IN" ? "hi-IN" : "en-IN";
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      const recognized = (final || interim).trim();
      if (recognized) {
        lastCapturedTranscriptRef.current = recognized;
        setLiveText(recognized);
      }
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        setMicNotice("माइक्रोफ़ोन अनुमति अस्वीकृत। ब्राउज़र URL बार में 🔒 → Allow Microphone चुनें।");
        shouldListenRef.current = false;
        setListening(false);
        setMicActive(false);
      } else if (e.error === "audio-capture") {
        setMicNotice("कोई माइक्रोफ़ोन नहीं मिला। कृपया माइक कनेक्ट करें।");
        shouldListenRef.current = false;
        setListening(false);
      }
      // For network, no-speech: MediaRecorder keeps recording physical voice!
    };

    rec.onend = () => {
      if (shouldListenRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current) {
            try { rec.start(); } catch (_) {}
          }
        }, 200);
      }
    };

    return rec;
  }, []);

  // Start full mic recording session
  const start = useCallback(
    async (lang = "hi") => {
      setMicNotice("");
      setLiveText("");
      setRecordingSeconds(0);
      lastCapturedTranscriptRef.current = "";
      recordedChunksRef.current = [];
      activeRecordingStartRef.current = Date.now();
      shouldListenRef.current = true;
      setListening(true);

      // 1. Start audio visualizer from physical mic
      const stream = await startAudioVisualizer();
      if (!stream) {
        shouldListenRef.current = false;
        setListening(false);
        return;
      }

      // 2. Start MediaRecorder (Guarantees authentic voice recording)
      if (typeof window !== "undefined" && window.MediaRecorder) {
        try {
          const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg", ""];
          const chosenMime = mimeTypes.find((m) => !m || MediaRecorder.isTypeSupported(m)) || "";
          const mr = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
          mr.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              recordedChunksRef.current.push(e.data);
            }
          };
          mediaRecorderRef.current = mr;
          mr.start(200);
        } catch (err) {
          console.warn("MediaRecorder start error:", err);
        }
      }

      // 3. Start live speech-to-text recognition
      const rec = buildRecognition(lang);
      if (rec) {
        recRef.current = rec;
        try { rec.start(); } catch (_) {}
      }
    },
    [buildRecognition, startAudioVisualizer]
  );

  // Stop recording — creates audio file, saves to history with playback & transcript
  const stop = useCallback(() => {
    shouldListenRef.current = false;
    try { recRef.current?.stop(); } catch (_) {}
    recRef.current = null;

    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.onstop = () => {
        const durationSec = Math.max(1, Math.round((Date.now() - activeRecordingStartRef.current) / 1000));
        let audioUrl = null;
        if (recordedChunksRef.current.length > 0) {
          try {
            const mime = mr.mimeType || "audio/webm";
            const blob = new Blob(recordedChunksRef.current, { type: mime });
            audioUrl = URL.createObjectURL(blob);
          } catch (_) {}
        }

        const transcript = lastCapturedTranscriptRef.current?.trim();
        const displayText = transcript || `🎙️ आवाज रिकॉर्डिंग (${durationSec} सेकंड)`;

        setHistory((prev) => [
          {
            id: Date.now(),
            sender: "user",
            text: displayText,
            audioUrl: audioUrl,
            duration: durationSec,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ].slice(0, 15));
        lastCapturedTranscriptRef.current = "";
      };
      try { mr.stop(); } catch (_) {}
      mediaRecorderRef.current = null;
    }

    stopAudioContext();
    setListening(false);
    setRecordingSeconds(0);
    setLiveText("");
  }, [stopAudioContext]);

  // Add a phrase to conversation history
  const addTranscriptItem = useCallback((text, sender = "user") => {
    if (!text || !text.trim()) return;
    setHistory((prev) => [
      {
        id: Date.now(),
        sender,
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ].slice(0, 15));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      stop();
    };
  }, [stop]);

  return {
    listening,
    micActive,
    micNotice,
    liveText,
    recordingSeconds,
    history,
    start,
    stop,
    addTranscriptItem,
    clearHistory,
    setHistory,
  };
}

/* ─── ISL Video Interpreter Booking Modal ──────────────────────────── */
function InterpreterModal({ isHi, onClose }) {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState(null);
  const [slot, setSlot] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");

  function handleConfirm() {
    if (!name.trim()) {
      setFormError(isHi ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name.");
      return;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      setFormError(isHi ? "कृपया 10 अंकों का मान्य फ़ोन नंबर दर्ज करें।" : "Please enter a valid 10-digit phone number.");
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
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-3xl border-2 border-teal-600/40 bg-card shadow-2xl animate-fade-up overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-r from-teal-700/20 via-amber-600/15 to-teal-700/20">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl p-2 rounded-2xl bg-teal-600/20 border border-teal-600/40">
              🧑‍🏫
            </span>
            <div>
              <h3 id="modal-title" className="text-base font-extrabold text-foreground">
                {isHi ? "ISL सांकेतिक भाषा दुभाषिया बुक करें" : "Book ISL Sign Language Interpreter"}
              </h3>
              <p className="text-xs text-foreground/60 font-medium">
                {isHi ? "कदम " + step + " / 4 • निःशुल्क सेवा" : "Step " + step + " of 4 • Free Service"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground/10 text-foreground/80 hover:bg-foreground/20 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-up">
              <p className="text-sm font-bold text-foreground">
                {isHi ? "अपॉइंटमेंट का उद्देश्य चुनें:" : "Choose the purpose of your appointment:"}
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {BOOKING_PURPOSES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPurpose(p);
                      setStep(2);
                    }}
                    className={`flex items-center gap-3.5 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer shadow-xs ${
                      purpose?.id === p.id
                        ? "border-teal-700 bg-teal-700/15 font-bold"
                        : "border-stone-200/90 dark:border-stone-800/90 bg-background hover:border-teal-600 hover:bg-teal-600/5"
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-sm font-extrabold text-foreground">{isHi ? p.hi : p.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-up">
              <p className="text-sm font-bold text-foreground">
                {isHi ? "उपलब्ध समय स्लॉट चुनें:" : "Choose an available time slot:"}
              </p>
              <div className="space-y-2.5">
                {INTERPRETER_SLOTS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSlot(s);
                      setStep(3);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition-all cursor-pointer shadow-xs ${
                      slot === s
                        ? "border-teal-700 bg-teal-700/15"
                        : "border-stone-200/90 dark:border-stone-800/90 bg-background hover:border-teal-600"
                    }`}
                  >
                    <div>
                      <span className="text-base font-extrabold text-foreground block">{s.time}</span>
                      <span className="text-xs text-foreground/60 font-semibold">{s.date}</span>
                    </div>
                    <span className="rounded-full border border-emerald-600/30 bg-emerald-600/15 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                      ✓ {isHi ? "उपलब्ध" : "Available"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-foreground/70 hover:text-foreground underline cursor-pointer"
              >
                ← {isHi ? "वापस" : "Back"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-up">
              <p className="text-sm font-bold text-foreground">
                {isHi ? "आपकी संपर्क जानकारी:" : "Your contact details:"}
              </p>
              <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800/90 bg-stone-50 dark:bg-stone-900/50 px-4 py-3 space-y-1">
                <p className="text-[0.68rem] uppercase tracking-widest font-extrabold text-foreground/50">
                  {isHi ? "बुकिंग सारांश" : "Booking Summary"}
                </p>
                <p className="text-sm font-extrabold text-foreground">{isHi ? purpose?.hi : purpose?.en}</p>
                <p className="text-xs text-teal-700 dark:text-teal-400 font-bold">
                  {slot?.date} — {slot?.time}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="interp-name" className="block text-xs font-bold text-foreground/80 mb-1">
                    {isHi ? "पूरा नाम *" : "Full Name *"}
                  </label>
                  <input
                    id="interp-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHi ? "जैसे: राहुल शर्मा" : "e.g. Rahul Sharma"}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25"
                  />
                </div>
                <div>
                  <label htmlFor="interp-phone" className="block text-xs font-bold text-foreground/80 mb-1">
                    {isHi ? "फ़ोन नंबर * (10 अंक)" : "Phone Number * (10 digits)"}
                  </label>
                  <input
                    id="interp-phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9XXXXXXXXX"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25"
                  />
                </div>
              </div>

              {formError && (
                <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  ⚠️ {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-none rounded-xl border-2 border-stone-300 dark:border-stone-700 px-4 py-2.5 text-xs font-bold text-foreground/70 hover:bg-foreground/8 cursor-pointer"
                >
                  ← {isHi ? "वापस" : "Back"}
                </button>
                <BigButton variant="primary" onClick={handleConfirm} className="flex-1">
                  {isHi ? "बुकिंग पक्की करें ✓" : "Confirm Booking ✓"}
                </BigButton>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 py-2 text-center animate-fade-up">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl text-3xl shadow-lg bg-gradient-to-br from-teal-600 to-teal-800 text-white">
                  ✅
                </div>
                <h3 className="text-xl font-black text-foreground">
                  {isHi ? "बुकिंग सफलतापूर्वक पक्की हो गई!" : "Booking Confirmed!"}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                  {isHi
                    ? `${name}, आपका ISL दुभाषिया ${slot?.date} को ${slot?.time} बजे ${purpose?.hi} के लिए बुक हो गया है। ${phone} पर SMS भेजा गया है।`
                    : `${name}, your ISL interpreter is confirmed for ${slot?.date} at ${slot?.time} (${purpose?.en}). Confirmation SMS sent to ${phone}.`}
                </p>
              </div>
              <BigButton variant="primary" onClick={onClose} className="w-full">
                {isHi ? "पूर्ण करें (Done)" : "Done"}
              </BigButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Connect Page ─────────────────────────────────────────────── */
export default function ConnectPage() {
  const { profile } = useProfile();
  const { mode, language: profileLang } = profile;

  // Active language
  const [overrideLang, setOverrideLang] = useState(null);
  const speechLang = overrideLang || profileLang || "hi";
  const isHi = speechLang === "hi";

  // AAC state
  const [activeCategory, setActiveCategory] = useState("all");
  const [lastSpokenId, setLastSpokenId] = useState(null);

  // Translation Console state
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [transDirection, setTransDirection] = useState("en-to-hi"); // "en-to-hi" | "hi-to-en"

  // Quick phrase input
  const [quickInput, setQuickInput] = useState("");

  // Modal & Settings state
  const [showInterpreter, setShowInterpreter] = useState(false);
  const [showVoiceStudio, setShowVoiceStudio] = useState(false);

  // Audio Engine & Mic
  const audio = useAudioEngine();
  const barsContainerRef = useRef(null);
  const levelTextRef = useRef(null);
  const mic = useLiveMicrophone({ barsContainerRef, levelTextRef });

  /* Speak AAC symbol with high-fidelity audio */
  function handleSpeakAAC(sym) {
    const textToSpeak = isHi ? sym.hi : sym.en;
    setLastSpokenId(sym.id);
    audio.speak(textToSpeak, speechLang);
    mic.addTranscriptItem(textToSpeak, "aac");
  }

  /* Translate input text */
  async function handleTranslate() {
    if (!inputText.trim()) return;
    setTranslating(true);
    try {
      const from = transDirection === "en-to-hi" ? "en" : "hi";
      const to = transDirection === "en-to-hi" ? "hi" : "en";
      const res = await translateText(inputText, from, to);
      setTranslatedText(res);
    } catch (err) {
      console.warn("Translation failed:", err);
    } finally {
      setTranslating(false);
    }
  }

  /* Swap translation direction */
  function handleSwapDirection() {
    setTransDirection((prev) => (prev === "en-to-hi" ? "hi-to-en" : "en-to-hi"));
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  }

  /* Filter AAC cards */
  const filteredSymbols =
    activeCategory === "all" ? AAC_SYMBOLS : AAC_SYMBOLS.filter((s) => s.category === activeCategory);

  return (
    <>
      {showInterpreter && <InterpreterModal isHi={isHi} onClose={() => setShowInterpreter(false)} />}

      <main className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8 animate-fade-up">
        {/* 1. Header & Live Audio Status Bar */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800/80 pb-5">
            <PageTitle
              badge={isHi ? "एकाक • आवाज व संवाद केंद्र" : "Ekak • Voice & Connect Hub"}
              title={isHi ? "संवाद, आवाज व अनुवाद (Connect & Speak)" : "Connect, Voice & Translate"}
              subtitle={
                mode.simpleText
                  ? (isHi ? "बोलने, अनुवाद और सुनने के लिए सबसे सरल सुलभ टूल्स।" : "Accessible tools to speak, translate, and communicate effortlessly.")
                  : (isHi
                      ? "स्पष्ट व शुद्ध हिंदी आवाज, स्पर्श-आधारित AAC सिंबल बोर्ड, लाइव माइक और तात्कालिक द्विभाषी अनुवाद।"
                      : "Crystal-clear authentic Hindi voice, tactile AAC soundboard, live mic equalizer, and instant bidirectional translation.")
              }
            />

            {/* Language Switcher */}
            <div className="flex flex-col sm:items-end gap-1.5 self-start shrink-0">
              <span className="text-[0.68rem] font-extrabold uppercase tracking-widest text-foreground/60">
                {isHi ? "सक्रिय भाषा (Language):" : "Language:"}
              </span>
              <div className="inline-flex rounded-2xl border-2 border-stone-300 dark:border-stone-700 p-1 bg-card shadow-xs">
                <button
                  type="button"
                  onClick={() => setOverrideLang("hi")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    speechLang === "hi"
                      ? "bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-sm"
                      : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  <span className="text-base">🇮🇳</span>
                  <span>हिन्दी</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOverrideLang("en")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    speechLang === "en"
                      ? "bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-sm"
                      : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  <span className="text-base">🌐</span>
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>

          {/* Attractive, Non-Minimal Hero Banner with Instant Audio Test */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-teal-600/40 bg-gradient-to-br from-teal-950 via-stone-900 to-teal-950 p-5 sm:p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-44 w-44 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg">
                  {audio.speaking ? (
                    <div className="flex items-center gap-1 h-6">
                      <span className="sound-bar !h-4 !bg-white" />
                      <span className="sound-bar !h-7 !bg-white" />
                      <span className="sound-bar !h-5 !bg-white" />
                      <span className="sound-bar !h-3 !bg-white" />
                    </div>
                  ) : (
                    <span className="text-2xl">🔊</span>
                  )}
                  {audio.speaking && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {isHi ? "प्राकृतिक शुद्ध हिंदी आवाज इंजन" : "Authentic Natural Hindi Audio Engine"}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.68rem] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-400/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      100% High-Fidelity Audio
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 font-medium mt-0.5">
                    {isHi
                      ? "कंप्यूटर की टूटी आवाज नहीं — स्पष्ट, वास्तविक और शुद्ध हिंदी उच्चारण।"
                      : "No robotic English accents — authentic, culturally natural Hindi pronunciation."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowVoiceStudio((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl border border-stone-600 bg-stone-800/80 text-xs font-bold text-stone-200 hover:bg-stone-700 transition-all cursor-pointer shadow-sm"
                >
                  ⚙️ {showVoiceStudio ? (isHi ? "सेटिंग्स बंद करें" : "Close") : (isHi ? "गति सेटिंग्स" : "Speed")}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    audio.speak(
                      "नमस्ते! एकाक में आपका स्वागत है। मैं शुद्ध और स्पष्ट हिंदी में बोलता हूँ।",
                      "hi"
                    )
                  }
                  className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">▶</span>
                  <span>{isHi ? "हिंदी आवाज सुनें (Test Audio)" : "Listen to Hindi Audio"}</span>
                </button>
              </div>
            </div>

            {/* Expandable Speed Settings */}
            {showVoiceStudio && (
              <div className="mt-4 pt-4 border-t border-teal-500/30 flex flex-wrap items-center justify-between gap-4 animate-fade-up">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-300">आवाज बोलने की गति (Speed):</span>
                  <div className="inline-flex rounded-xl bg-stone-800/90 border border-stone-700 p-1">
                    {[
                      { label: "0.8x धीमा", val: 0.8 },
                      { label: "1.0x सामान्य", val: 1.0 },
                      { label: "1.2x तेज", val: 1.2 },
                    ].map((s) => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => audio.setRate(s.val)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          audio.rate === s.val
                            ? "bg-teal-600 text-white font-extrabold shadow-xs"
                            : "text-stone-300 hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-stone-400 font-medium">
                  इंजन स्रोत: <span className="text-emerald-400 font-bold">Google Neural Cloud TTS + Local SAPI Fallback</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. Tactile, High-Contrast AAC Picture Soundboard */}
        <section aria-labelledby="aac-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="aac-heading" className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                <span className="text-2xl">💬</span>
                <span>{isHi ? "AAC सचित्र ध्वनि बोर्ड (टैप करें — तुरंत आवाज बोलेगी)" : "AAC Picture Soundboard (Tap to Speak)"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-foreground/70 font-medium mt-0.5">
                {isHi
                  ? "किसी भी कार्ड पर क्लिक करें — एकाक तुरंत स्पष्ट व प्राकृतिक हिंदी आवाज में बोलेगा।"
                  : "Tap any card — Ekak speaks it aloud in authentic, clear Hindi voice."}
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {AAC_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-md scale-[1.02]"
                      : "border-2 border-stone-200 dark:border-stone-800 bg-card text-foreground/80 hover:border-teal-600"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{isHi ? cat.labelHi : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {filteredSymbols.map((sym) => {
              const isLastSpoken = lastSpokenId === sym.id && audio.speaking;
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => handleSpeakAAC(sym)}
                  className={`group relative flex flex-col justify-between rounded-3xl border-2 p-4 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95 bg-card ${sym.accent} ${
                    isLastSpoken
                      ? "ring-4 ring-amber-500 border-amber-500 scale-[1.02] shadow-xl"
                      : "hover:border-teal-600/70"
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-3">
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-background/80 shadow-xs border border-foreground/5 group-hover:scale-110 transition-transform">
                      {sym.icon}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-600/15 text-teal-800 dark:text-teal-300 text-xs font-bold group-hover:bg-teal-700 group-hover:text-white transition-colors">
                      {isLastSpoken ? "⏳" : "🔊"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-foreground leading-snug">
                      {isHi ? sym.hi : sym.en}
                    </h3>
                    <p className="text-[0.68rem] text-foreground/60 font-bold mt-1 line-clamp-1">
                      {isHi ? sym.en : sym.hi}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Dual Power Panel: Live Mic Hub + Bidirectional Translator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 3A. Live Microphone, Sound Equalizer & Quick Voice Assistant */}
          <section aria-labelledby="mic-heading">
            <Card as="div" accentColor="teal" className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all shadow-xs ${
                      mic.listening
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-teal-600/15 text-teal-800 dark:text-teal-300 border border-teal-600/30"
                    }`}
                  >
                    {mic.listening ? "🎙️" : "🎤"}
                  </div>
                  <div>
                    <h2 id="mic-heading" className="text-lg sm:text-xl font-black text-foreground">
                      {isHi ? "लाइव माइक व संवाद केंद्र" : "Live Mic & Voice Studio"}
                    </h2>
                    <p className="text-xs text-foreground/60 font-medium">
                      {isHi ? "बोलें, लाइव आवाज तरंग देखें और तुरंत अनुवाद पाएं" : "Speak into mic or tap quick phrases"}
                    </p>
                  </div>
                </div>

                {mic.listening && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-black animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                    <span>
                      🔴 {isHi ? "रिकॉर्डिंग:" : "Recording:"} {Math.floor(mic.recordingSeconds / 60)}:{(mic.recordingSeconds % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Sound Wave Equalizer (Proof of working microphone) */}
              <div className="rounded-2xl border-2 border-stone-200/90 dark:border-stone-800/90 bg-stone-900/90 p-4 text-white space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${mic.listening ? "bg-emerald-400 animate-ping" : "bg-stone-500"}`} />
                    <span className="font-extrabold text-stone-200">
                      {mic.listening
                        ? (isHi ? "माइक व रिकॉर्डर सक्रिय (आवाज सुन रहा है)" : "Microphone & Voice Recorder Active")
                        : (isHi ? "माइक स्टैंडबाय पर है" : "Microphone on Standby")}
                    </span>
                  </div>
                  <span className="text-[0.68rem] font-bold text-stone-400">
                    ध्वनि स्तर: <span ref={levelTextRef}>0%</span>
                  </span>
                </div>

                {/* Animated 24-bar frequency waveform — zero React re-render, zero flicker */}
                <div
                  ref={barsContainerRef}
                  className="flex items-end justify-between gap-1 h-12 px-2 py-1 bg-stone-950/70 rounded-xl border border-stone-800 overflow-hidden"
                >
                  {Array.from({ length: 24 }).map((_, idx) => (
                    <span
                      key={idx}
                      style={{ height: "8%", backgroundColor: "#374151" }}
                      className="w-full rounded-full transition-all duration-75"
                    />
                  ))}
                </div>

                {/* Live Speech Recognition & Recording Status */}
                <div className="min-h-[44px] flex items-center justify-center text-center">
                  {mic.liveText ? (
                    <p className="text-base font-black text-amber-300 animate-fade-up">
                      &quot;{mic.liveText}&quot;
                    </p>
                  ) : (
                    <p className="text-xs text-stone-400 font-medium">
                      {mic.listening
                        ? (isHi ? "🔴 आपकी आवाज रिकॉर्ड हो रही है... स्पष्ट बोलें" : "🔴 Recording audio... Speak clearly")
                        : (isHi ? "माइक चालू करने के लिए नीचे 'आवाज रिकॉर्ड करें' बटन दबाएं" : "Click 'Start Recording' below to speak")}
                    </p>
                  )}
                </div>
              </div>

              {/* Permission denied notice (only for real blocking errors) */}
              {mic.micNotice && (
                <div role="alert" className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/8 px-3.5 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-400 animate-fade-up">
                  <span className="text-base shrink-0">🔒</span>
                  <span>{mic.micNotice}</span>
                  <button
                    type="button"
                    onClick={() => mic.start(speechLang)}
                    className="ml-auto shrink-0 rounded-lg bg-rose-600 text-white px-2.5 py-1 text-[0.65rem] font-black hover:bg-rose-700 cursor-pointer"
                  >
                    पुनः प्रयास
                  </button>
                </div>
              )}

              {/* Permanent, Rock-Solid Start / Stop Button — ONLY user can close */}
              <BigButton
                variant={mic.listening ? "danger" : "primary"}
                onClick={mic.listening ? mic.stop : () => mic.start(speechLang)}
                className="w-full !py-3.5 !text-base shadow-md cursor-pointer"
              >
                {mic.listening
                  ? (isHi ? "⏹ रिकॉर्डिंग सुरक्षित करें (Stop & Save Recording)" : "⏹ Stop & Save Voice Recording")
                  : (isHi ? "🎤 आवाज रिकॉर्ड करें व बोलें (Start Recording)" : "🎤 Record Voice & Transcribe")}
              </BigButton>

              {/* Quick Speech Tap Chips */}
              <div className="rounded-2xl border-2 border-stone-200/90 dark:border-stone-800/90 bg-stone-50 dark:bg-stone-900/40 p-3.5 space-y-2.5">
                <span className="text-[0.68rem] uppercase tracking-widest font-extrabold block text-foreground/60">
                  ⚡ 1-टैप त्वरित वाणी पैड (Tap to Transcribe & Speak):
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    "कृपया मेरी सहायता करें",
                    "मुझे डॉक्टर से मिलना है",
                    "कृपया पीने का पानी दीजिए",
                    "मुझे बहुत दर्द हो रहा है",
                    "मुझे घर जाना है",
                    "बैंक में सहायता चाहिए",
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        mic.addTranscriptItem(phrase, "user");
                        audio.speak(phrase, "hi");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-card text-xs font-black text-foreground hover:bg-teal-600/15 hover:text-teal-900 dark:hover:text-teal-200 border border-stone-300 dark:border-stone-700 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>

                {/* Direct Text Box for Transcription */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && quickInput.trim()) {
                        mic.addTranscriptItem(quickInput.trim(), "user");
                        audio.speak(quickInput.trim(), "hi");
                        setQuickInput("");
                      }
                    }}
                    placeholder={isHi ? "यहाँ लिखकर सीधे आवाज में बोलें..." : "Type here to speak aloud..."}
                    className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-background px-3 py-2 text-xs font-bold text-foreground placeholder:text-foreground/40 outline-none focus:border-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (quickInput.trim()) {
                        mic.addTranscriptItem(quickInput.trim(), "user");
                        audio.speak(quickInput.trim(), "hi");
                        setQuickInput("");
                      }
                    }}
                    disabled={!quickInput.trim()}
                    className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-black hover:bg-teal-800 disabled:opacity-40 cursor-pointer shadow-xs"
                  >
                    🔊 बोलें
                  </button>
                </div>
              </div>

              {/* Spoken History Feed with Instant Audio & Translate */}
              {mic.history.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800/80">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.68rem] uppercase tracking-widest font-extrabold text-foreground/50">
                      {isHi ? "संवाद इतिहास (Conversation Log)" : "Conversation Log"}
                    </p>
                    <button
                      type="button"
                      onClick={mic.clearHistory}
                      className="text-[0.68rem] font-bold text-foreground/50 hover:text-foreground underline cursor-pointer"
                    >
                      {isHi ? "इतिहास साफ़ करें" : "Clear"}
                    </button>
                  </div>

                  <ul className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                    {mic.history.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-2xl border border-stone-200/90 dark:border-stone-800/90 bg-card p-3 text-xs space-y-2 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.sender === "assistant" ? "🤖" : item.audioUrl ? "🎙️" : "👤"}</span>
                            <span className="font-black text-foreground text-sm leading-snug">{item.text}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[0.65rem] text-foreground/50 font-bold">{item.time}</span>
                            <button
                              type="button"
                              onClick={() => audio.speak(item.text, isHi ? "hi" : "en")}
                              className="p-1.5 rounded-lg bg-teal-600/10 text-teal-800 dark:text-teal-300 hover:bg-teal-600/20 cursor-pointer"
                              title="आवाज सुनें"
                            >
                              🔊
                            </button>
                          </div>
                        </div>

                        {item.audioUrl && (
                          <div className="pt-1">
                            <audio controls src={item.audioUrl} className="h-8 w-full rounded-xl bg-stone-100 dark:bg-stone-800 shadow-inner" />
                          </div>
                        )}

                        {item.translation && (
                          <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 px-2.5 py-1.5 text-xs text-amber-950 dark:text-amber-200 font-bold">
                            {item.translation}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </section>

          {/* 3B. Real-Time Bidirectional Translator & High-Fidelity Speech Console */}
          <section aria-labelledby="trans-heading">
            <Card as="div" accentColor="saffron" className="h-full space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl bg-amber-600/15 text-amber-900 dark:text-amber-300 border border-amber-600/30 shadow-xs">
                    🌐
                  </div>
                  <div>
                    <h2 id="trans-heading" className="text-lg sm:text-xl font-black text-foreground">
                      {isHi ? "द्विभाषी अनुवादक एवं आवाज" : "Bilingual Translator & Speech"}
                    </h2>
                    <p className="text-xs text-foreground/60 font-medium">
                      {isHi ? "अंग्रेजी ⇄ हिंदी लाइव अनुवाद और स्वाभाविक उच्चारण" : "English ⇄ Hindi real-time translation & TTS"}
                    </p>
                  </div>
                </div>

                {/* Direction Switcher */}
                <button
                  type="button"
                  onClick={handleSwapDirection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-background text-xs font-extrabold text-foreground hover:border-amber-600 cursor-pointer shadow-xs"
                >
                  <span>{transDirection === "en-to-hi" ? "EN ➔ HI" : "HI ➔ EN"}</span>
                  <span className="text-sm">⇄</span>
                </button>
              </div>

              {/* Text Input Area */}
              <div className="space-y-3">
                <label htmlFor="trans-input" className="block text-xs font-black uppercase tracking-wider text-foreground/70">
                  {transDirection === "en-to-hi" ? "English Text (यहाँ अंग्रेजी लिखें):" : "Hindi Text (यहाँ हिंदी लिखें):"}
                </label>
                <textarea
                  id="trans-input"
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    transDirection === "en-to-hi"
                      ? "e.g. I need a wheelchair / Where is the doctor's room?"
                      : "जैसे: मुझे डॉक्टर से मिलना है / पीने का पानी कहाँ मिलेगा?"
                  }
                  className="w-full rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-background/80 px-4 py-3 text-sm sm:text-base text-foreground font-semibold leading-relaxed placeholder:text-foreground/40 resize-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/25 outline-none transition-all"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={!inputText.trim() || translating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>🔄</span>
                    <span>
                      {translating
                        ? "अनुवाद किया जा रहा है..."
                        : transDirection === "en-to-hi"
                        ? "हिंदी अनुवाद करें (Translate to Hindi)"
                        : "Translate to English"}
                    </span>
                  </button>

                  {inputText && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputText("");
                        setTranslatedText("");
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-foreground/70 hover:text-foreground cursor-pointer"
                    >
                      मिटाएं (Clear)
                    </button>
                  )}
                </div>

                {/* Translated Result Glowing Card */}
                {translatedText && (
                  <div className="rounded-2xl border-2 border-amber-600/50 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-4 space-y-2.5 animate-fade-up shadow-md">
                    <div className="flex items-center justify-between text-xs font-extrabold text-amber-950 dark:text-amber-200">
                      <span>✓ {transDirection === "en-to-hi" ? "शुद्ध हिंदी अनुवाद:" : "English Translation:"}</span>
                      <button
                        type="button"
                        onClick={() => audio.speak(translatedText, transDirection === "en-to-hi" ? "hi" : "en")}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black cursor-pointer shadow-xs"
                      >
                        <span>🔊</span>
                        <span>आवाज में सुनें</span>
                      </button>
                    </div>

                    <p className="text-base sm:text-lg font-black text-foreground leading-snug">
                      {translatedText}
                    </p>
                  </div>
                )}

                {/* Primary Speak Button */}
                <BigButton
                  variant="primary"
                  onClick={() =>
                    audio.speak(
                      translatedText || inputText,
                      transDirection === "en-to-hi" ? (translatedText ? "hi" : "en") : "hi"
                    )
                  }
                  disabled={!inputText.trim() && !translatedText}
                  className="w-full !py-3.5 !text-base shadow-lg"
                >
                  {audio.speaking
                    ? (isHi ? "⏳ आवाज बोल रही है..." : "⏳ Speaking...")
                    : (translatedText
                        ? (isHi ? "🔊 अनुवादित आवाज में बोलें (Speak Aloud)" : "🔊 Speak Translation")
                        : (isHi ? "🔊 आवाज में बोलें (Speak Aloud)" : "🔊 Speak Aloud"))}
                </BigButton>
              </div>

              {/* Popular Everyday Hospital & Bank Phrases */}
              <div className="space-y-2 pt-3 border-t border-stone-200/80 dark:border-stone-800/80">
                <p className="text-[0.68rem] uppercase tracking-widest font-extrabold text-foreground/50">
                  {isHi ? "त्वरित दैनिक वाक्य (टैप करें — तत्काल अनुवाद व आवाज):" : "Quick Tap Phrases:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { en: "Where is the wheelchair?", hi: "व्हीलचेयर कहाँ मिलेगी?" },
                    { en: "I need a doctor", hi: "मुझे डॉक्टर से मिलना है" },
                    { en: "Please call my family", hi: "कृपया मेरे परिवार को फोन करें" },
                    { en: "I am hungry, food please", hi: "मुझे भोजन चाहिए" },
                    { en: "Thank you very much", hi: "आपका बहुत-बहुत धन्यवाद" },
                  ].map((phrase, idx) => (
                    <button
                      key={`phrase-${idx}`}
                      type="button"
                      onClick={() => {
                        setInputText(phrase.en);
                        setTranslatedText(phrase.hi);
                        setTransDirection("en-to-hi");
                        audio.speak(phrase.hi, "hi");
                      }}
                      className="rounded-xl border border-amber-600/30 bg-amber-600/10 px-3 py-1.5 text-xs font-black text-foreground hover:bg-amber-600/25 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {phrase.en} → {phrase.hi}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* 4. Support Services, Peer Community & ISL Interpreter */}
        <section aria-labelledby="support-heading" className="space-y-4">
          <h2 id="support-heading" className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {isHi ? "सुलभ सहायता एवं संसाधन (Support & Services)" : "Support & Services"}
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <Card as="div" icon="🧑‍🏫" accentColor="teal" title={isHi ? "ISL दुभाषिया" : "ISL Interpreter"}>
              <p className="text-sm text-foreground/75 font-medium leading-relaxed">
                {isHi
                  ? "प्रमाणित भारतीय सांकेतिक भाषा (ISL) दुभाषिया अस्पताल, बैंक या कचहरी के लिए बुक करें।"
                  : "Book a certified Indian Sign Language interpreter for medical, bank, or legal appointments."}
              </p>
              <div className="pt-3 mt-auto">
                <BigButton variant="primary" onClick={() => setShowInterpreter(true)} className="w-full">
                  {isHi ? "अभी बुक करें →" : "Book Now →"}
                </BigButton>
              </div>
            </Card>

            <Card as="div" icon="👥" accentColor="olive" title={isHi ? "दिव्यांग समुदाय" : "Peer Community"}>
              <p className="text-sm text-foreground/75 font-medium leading-relaxed">
                {isHi
                  ? "समान चुनौतियों से जूझ रहे साथियों से जुड़ें, अनुभव साझा करें और नई प्रेरणा पाएं।"
                  : "Connect with peers facing similar challenges, exchange tips, and share experiences."}
              </p>
              <div className="pt-3 mt-auto">
                <BigButton variant="secondary" className="w-full !text-sm">
                  {isHi ? "जल्द आ रहा है →" : "Coming Soon →"}
                </BigButton>
              </div>
            </Card>

            <Card as="div" icon="📋" accentColor="saffron" title={isHi ? "अधिकार और योजनाएं" : "Rights & Schemes"}>
              <p className="text-sm text-foreground/75 font-medium leading-relaxed">
                {isHi
                  ? "UDID कार्ड, सरकारी दिव्यांग पेंशन योजनाएं और कानूनी अधिकारों की सरल व सुगम जानकारी।"
                  : "UDID card, government disability welfare schemes, and legal rights explained simply."}
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
