// Custom hook for accessing and updating user accessibility profile
"use client";
// Components profile yahin se padhte hain

import { useContext } from "react";
import { ProfileContext } from "@/context/ProfileProvider";

export default function useProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
    return ctx;
}