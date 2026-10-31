// Adaptation engine to dynamically apply UI adjustments based on user profile
// Adaptive engine: profile -> <html> attributes + CSS variables

export function applyProfile(profile) {
    if (typeof document === "undefined") return; // server pe kuch nahi

    const root = document.documentElement;
    const { mode, language } = profile;

    root.lang = language;
    root.style.setProperty("--font-scale", String(mode.fontScale));
    root.dataset.contrast = mode.highContrast ? "high" : "normal";
    root.dataset.simple = String(mode.simpleText);
    root.dataset.captions = String(mode.captions);
    root.dataset.voice = String(mode.voice);
}