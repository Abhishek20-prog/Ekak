"use client";

import { useEffect, useRef, useCallback } from "react";
import useProfile from "@/hooks/useProfile";
import { usePathname } from "next/navigation";

export default function VoiceGuide() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const lastPath = useRef("");

  const speak = useCallback((text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.lang = profile?.language === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  }, [profile?.language]);

  useEffect(() => {
    // Check if blind disability is selected or voice is active
    const isBlind = profile?.disabilities?.includes("blind") || profile?.mode?.voice;
    if (!isBlind) return;

    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      
      let msg = "";
      if (pathname === "/onboarding") {
        msg = profile?.language === "hi"
          ? "एकक में आपका स्वागत है। कृपया अपनी प्राथमिकताएं चुनें।"
          : "Welcome to Ekak. Please select your accessibility preferences to continue.";
      } else if (pathname === "/signup") {
        msg = profile?.language === "hi"
          ? "अपना खाता बनाएं। अपना नाम, ईमेल और पासवर्ड दर्ज करें।"
          : "Create your account. Please enter your full name, email, and password.";
      } else if (pathname === "/login") {
        msg = profile?.language === "hi"
          ? "लॉग इन करें। अपना ईमेल और पासवर्ड दर्ज करें।"
          : "Log in to your account. Enter your email and password.";
      } else if (pathname === "/home") {
        msg = profile?.language === "hi"
          ? "आप होम डैशबोर्ड पर हैं। नेविगेशन डॉक से सीखें, कार्य और कनेक्ट तक पहुंचें।"
          : "You are on the Home dashboard. Use the navigation dock to access Learn, Work, and Connect.";
      } else if (pathname === "/profile") {
        msg = profile?.language === "hi"
          ? "आप अपनी प्रोफ़ाइल और एक्सेसिबिलिटी प्राथमिकताओं पर हैं।"
          : "You are on your profile and accessibility settings.";
      }

      if (msg) {
        // Small delay to let browser ready
        setTimeout(() => speak(msg), 400);
      }
    }
  }, [pathname, profile, speak]);

  return null;
}
