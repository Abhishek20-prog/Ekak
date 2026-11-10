"use client";
// Profile JSON ka single source of truth (Context + localStorage) + engine trigger

import { createContext, useCallback, useEffect, useState } from "react";
import { DEFAULT_PROFILE } from "@/lib/profileDefaults";
import { applyProfile } from "@/lib/adaptEngine";

export const ProfileContext = createContext(null);
const STORAGE_KEY = "seva-profile";

export default function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [loaded, setLoaded] = useState(false);

    // Page khulte hi saved profile padho
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved) setProfile(JSON.parse(saved));
        } catch (e) {
            console.error("Profile load failed", e);
        }
        setLoaded(true);
    }, []);

    // Profile badalte hi save karo
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } catch (e) {
            console.error("Profile save failed", e);
        }
    }, [profile, loaded]);

    // Profile badalte hi UI adapt karo (engine)
    useEffect(() => {
        if (loaded) applyProfile(profile);
    }, [profile, loaded]);

    const saveProfile = (p) => setProfile(p);
    const updateMode = (partial) =>
        setProfile((p) => ({ ...p, mode: { ...p.mode, ...partial } }));

    // Full reset: wipe localStorage key and restore DEFAULT_PROFILE
    const resetProfile = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {}
        setProfile({ ...DEFAULT_PROFILE });
    }, []);

    const isOnboarded = profile.disabilities.length > 0;

    return (
        <ProfileContext.Provider
            value={{ profile, loaded, isOnboarded, saveProfile, updateMode, resetProfile }}
        >
            {children}
        </ProfileContext.Provider>
    );
}
