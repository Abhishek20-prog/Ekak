"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { announce } from "@/lib/announce";
import { parsePrefs, readPrefsRaw, subscribePrefs } from "@/lib/a11y-client";

const noopSubscribe = () => () => {};

// Browsers cut off very long utterances, so read in sentence-sized chunks.
function chunkText(text) {
  const sentences = text.replace(/\s+/g, " ").match(/[^.!?।]+[.!?।]*\s*/g) ?? [text];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > 200 && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Optional built-in "read this page aloud" for low-vision users who don't run a screen reader.
// Shown only if the user turned it on in their profile, and never in screen-reader mode.
export default function ReadAloud() {
  const supported = useSyncExternalStore(noopSubscribe, () => "speechSynthesis" in window, () => false);
  const raw = useSyncExternalStore(subscribePrefs, readPrefsRaw, () => "");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const prefs = parsePrefs(raw);
  if (!supported || !prefs.ra || prefs.sr) return null;

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    announce("Stopped reading.");
  }

  function start() {
    const text = document.getElementById("main")?.innerText?.trim();
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const parts = chunkText(text);
    parts.forEach((part, index) => {
      const utterance = new SpeechSynthesisUtterance(part);
      utterance.rate = prefs.rate ?? 1;
      utterance.lang = document.documentElement.lang || "en";
      utterance.onerror = (event) => {
        if (event.error !== "canceled" && event.error !== "interrupted") setSpeaking(false);
      };
      if (index === parts.length - 1) utterance.onend = () => setSpeaking(false);
      synth.speak(utterance);
    });
    setSpeaking(true);
  }

  return (
    <button type="button" className="btn" aria-pressed={speaking} onClick={speaking ? stop : start}>
      Read this page aloud
    </button>
  );
}
