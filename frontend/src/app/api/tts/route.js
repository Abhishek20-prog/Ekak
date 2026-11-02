// Next.js Server Route: High-Fidelity Natural Hindi & Multilingual Audio TTS Engine
// Delivers authentic, culturally natural Hindi speech without robotic mispronunciation

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "";
  const lang = searchParams.get("lang") || "hi";

  if (!text.trim()) {
    return new Response(JSON.stringify({ error: "Missing text query parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Google TTS tw-ob endpoint supports up to ~200 characters per segment
  const sanitizedText = text.trim().slice(0, 200);
  const targetLang = lang.startsWith("en") ? "en" : "hi";
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sanitizedText)}&tl=${targetLang}&client=tw-ob`;

  try {
    const upstreamRes = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "audio/mpeg,audio/*;q=0.9",
      },
      next: { revalidate: 86400 }, // Cache audio for 24 hours
    });

    if (!upstreamRes.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream TTS error: status ${upstreamRes.status}` }),
        {
          status: upstreamRes.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const audioArrayBuffer = await upstreamRes.arrayBuffer();

    return new Response(audioArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioArrayBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    console.error("TTS Route Exception:", err);
    return new Response(
      JSON.stringify({ error: "Server TTS fetch failed: " + err.message }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

