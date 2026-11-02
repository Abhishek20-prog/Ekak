// Next.js Server Route: High-Accuracy Bidirectional Hindi <-> English Translation
import { COMMON_TRANSLATIONS } from "@/lib/translate";

// Pre-build reverse dictionary
const REVERSE_TRANSLATIONS = {};
for (const [en, hi] of Object.entries(COMMON_TRANSLATIONS)) {
  REVERSE_TRANSLATIONS[hi.toLowerCase()] = en;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = (searchParams.get("text") || "").trim();
  const from = (searchParams.get("from") || "en").slice(0, 2);
  const to = (searchParams.get("to") || "hi").slice(0, 2);

  if (!text) {
    return Response.json({ translated: "" });
  }

  const lower = text.toLowerCase();

  // 1. Instant offline dictionary lookup
  if (from === "en" && to === "hi") {
    if (COMMON_TRANSLATIONS[lower]) {
      return Response.json({ translated: COMMON_TRANSLATIONS[lower], source: "dictionary" });
    }
    const stripped = lower.replace(/[?.!,]/g, "").trim();
    if (COMMON_TRANSLATIONS[stripped]) {
      return Response.json({ translated: COMMON_TRANSLATIONS[stripped], source: "dictionary" });
    }
  } else if (from === "hi" && to === "en") {
    if (REVERSE_TRANSLATIONS[lower]) {
      return Response.json({ translated: REVERSE_TRANSLATIONS[lower], source: "dictionary" });
    }
  }

  // 2. Google Translate GTX Server-to-Server
  try {
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(gtxUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const fullTranslation = data[0]
          .map((item) => (Array.isArray(item) ? item[0] : ""))
          .filter(Boolean)
          .join("");
        if (fullTranslation.trim()) {
          return Response.json({ translated: fullTranslation.trim(), source: "google" });
        }
      }
    }
  } catch (err) {
    console.warn("Server GTX translation error:", err.message);
  }

  // 3. MyMemory Fallback
  try {
    const langpair = `${from}|${to}`;
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    const res = await fetch(myMemoryUrl, {
      headers: {
        "User-Agent": "EkakApp/1.0",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (
        data?.responseData?.translatedText &&
        !data.responseData.translatedText.startsWith("MYMEMORY WARNING")
      ) {
        return Response.json({
          translated: data.responseData.translatedText.trim(),
          source: "mymemory",
        });
      }
    }
  } catch (err) {
    console.warn("MyMemory translation error:", err.message);
  }

  // Return original text if translation service unavailable
  return Response.json({ translated: text, source: "original" });
}

