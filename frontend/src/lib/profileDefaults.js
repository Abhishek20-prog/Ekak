// Default accessibility profiles and mode configuration presets
// Default profile + disability -> mode mapping

export const DEFAULT_PROFILE = {
    disabilities: [],
    language: "en",
    mode: {
        captions: false,
        voice: false,
        simpleText: false,
        highContrast: false,
        fontScale: 1.0,
    },
};

export const DISABILITY_MODES = {
    deaf: { captions: true },
    speech: {},
    blind: { voice: true, highContrast: true, fontScale: 1.25 },
    motor: { voice: true },
    cognitive: { simpleText: true },
};

// Multi-disability: jo mode koi bhi on kare woh on; font sabse bada
export function buildProfile(disabilities, language) {
    const mode = { ...DEFAULT_PROFILE.mode };
    for (const d of disabilities) {
        const rules = DISABILITY_MODES[d] || {};
        for (const [key, value] of Object.entries(rules)) {
            if (key === "fontScale") mode.fontScale = Math.max(mode.fontScale, value);
            else if (value === true) mode[key] = true;
        }
    }
    return { disabilities, language, mode };
}