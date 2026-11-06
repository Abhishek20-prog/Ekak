"use client";
// Accessible Work screen for Ekak: displays inclusive jobs with prominent accessibility accommodation tags and dynamic tag filtering

import { useState, useEffect, useMemo } from "react";
import useProfile from "@/hooks/useProfile";
import { getJobs } from "@/lib/api";
import { PageTitle, Card, BigButton } from "@/components/ui";

export default function WorkPage() {
  const { profile } = useProfile();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [appliedJobId, setAppliedJobId] = useState(null);

  const { mode, language } = profile;
  const isHi = language === "hi";

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const data = await getJobs();
        if (isMounted) setJobs(data);
      } catch (err) {
        if (isMounted) setError("Failed to load job listings. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique accessibility tags across all jobs
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    jobs.forEach((job) => {
      (job.accessibilityTags || []).forEach((tag) => tagsSet.add(tag));
    });
    return ["All", ...Array.from(tagsSet)];
  }, [jobs]);

  // Filter jobs based on selected accessibility tag
  const filteredJobs = useMemo(() => {
    if (selectedTag === "All") return jobs;
    return jobs.filter((job) =>
      (job.accessibilityTags || []).includes(selectedTag)
    );
  }, [jobs, selectedTag]);

  const handleApply = (jobId) => {
    setAppliedJobId(jobId);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8 animate-fade-up">
      {/* 1. Header */}
      <PageTitle
        badge={isHi ? "समान रोजगार • एकाक" : "Inclusive Careers • Ekak"}
        title={isHi ? "दिव्यांग-अनुकूल रोजगार और नौकरियां" : "Inclusive Employment Opportunities"}
        subtitle={
          mode.simpleText
            ? (isHi ? "सत्यापित सुलभ नौकरियां खोजें।" : "Find verified accessible job openings.")
            : (isHi
              ? "सत्यापित नियोक्ताओं के पास ऐसी नौकरियां जहां स्क्रीन रीडर, लचीले घंटे और सुलभ कार्यस्थल उपकरण उपलब्ध हैं।"
              : "Explore verified employer openings offering screen reader support, flexible remote work, and workplace accommodations.")
        }
      />

      {/* 2. Application Submitted Announcement */}
      {appliedJobId && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-600 bg-emerald-600/10 p-4 font-bold text-foreground shadow-sm animate-fade-up"
        >
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="text-xl">🎉</span>
            <span className="text-sm sm:text-base font-extrabold">
              {isHi
                ? "आपका आवेदन सफलतापूर्वक भेज दिया गया है! कंपनी जल्द संपर्क करेगी।"
                : "Application submitted successfully! The inclusive employer will reach out shortly."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAppliedJobId(null)}
            className="rounded-xl px-3 py-1 bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 cursor-pointer shadow-xs shrink-0"
          >
            {isHi ? "बंद करें" : "Dismiss"}
          </button>
        </div>
      )}

      {/* 3. Loading State */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-[14rem] flex-col items-center justify-center gap-3 rounded-2xl border border-stone-200/90 dark:border-stone-700/90 bg-card p-6 text-center seva-card"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-700 border-t-transparent" />
          <p className="text-base font-bold text-foreground">
            {isHi ? "नौकरियां लोड हो रही हैं..." : "Loading accessible job opportunities..."}
          </p>
        </div>
      )}

      {/* 4. Error State */}
      {error && !loading && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-rose-500 bg-rose-500/10 p-5 text-center text-rose-600 dark:text-rose-400 space-y-2.5"
        >
          <p className="text-base font-bold">{error}</p>
          <BigButton variant="danger" onClick={() => window.location.reload()} className="!min-h-[44px] !text-sm">
            {isHi ? "पुनः प्रयास करें" : "Retry"}
          </BigButton>
        </div>
      )}

      {/* 5. Accessibility Tags Filter Bar */}
      {!loading && !error && jobs.length > 0 && (
        <section aria-label="Job Accessibility Filters" className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground/70">
              {isHi ? "सुलभता सुविधा अनुसार फ़िल्टर करें:" : "Filter by Accessibility Accommodation:"}
            </h2>
            <span role="status" aria-live="polite" className="text-xs font-bold text-foreground/60">
              {isHi
                ? `${filteredJobs.length} नौकरियां उपलब्ध`
                : `${filteredJobs.length} ${filteredJobs.length === 1 ? "role" : "roles"} found`}
            </span>
          </div>

          <div
            role="group"
            aria-label="Accessibility tag filters"
            className="flex flex-wrap gap-2"
          >
            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  aria-pressed={isSelected}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 ${isSelected
                      ? "bg-blue-700 text-white shadow-xs"
                      : "border border-stone-300 dark:border-stone-700 bg-card text-foreground/80 hover:bg-current/10 hover:border-current"
                    }`}
                >
                  <span className="text-xs">{tag === "All" ? "🌟" : "🏷️"}</span>
                  <span>{tag === "All" ? (isHi ? "सभी (All)" : "All Accommodations") : tag}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Empty Filtered Results State */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div
          role="status"
          className="rounded-2xl border border-stone-200/90 dark:border-stone-700/90 bg-card p-8 text-center space-y-3 seva-card"
        >
          <span aria-hidden="true" className="text-3xl">🔍</span>
          <p className="text-lg font-bold">
            {isHi
              ? `फ़िल्टर '${selectedTag}' के लिए कोई नौकरी नहीं मिली।`
              : `No job openings found matching filter '${selectedTag}'.`}
          </p>
          <BigButton variant="secondary" onClick={() => setSelectedTag("All")} className="!min-h-[44px] !text-sm">
            {isHi ? "सभी फ़िल्टर साफ़ करें" : "Reset Filter to All"}
          </BigButton>
        </div>
      )}

      {/* 7. Jobs Grid */}
      {!loading && !error && filteredJobs.length > 0 && (
        <section aria-label="Job Postings" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobId === job.id;
            const isRemote = (job.location || "").toLowerCase().includes("remote");
            const locBadge = isRemote
              ? (isHi ? "🌐 रिमोट" : "🌐 Remote")
              : (isHi ? "📍 हाइब्रिड" : "📍 Hybrid");

            return (
              <Card
                key={job.id}
                as="article"
                icon="💼"
                accentColor="olive"
                title={job.title}
                badge={locBadge}
                className="h-full shadow-sm"
              >
                {/* Company & Location Info */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-bold text-foreground/80">
                  <span className="flex items-center gap-1.5 font-black text-foreground text-sm">
                    <span aria-hidden="true">🏢</span>
                    <span>{job.company}</span>
                  </span>
                  <span className="text-foreground/30">•</span>
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-extrabold">
                    <span aria-hidden="true">📍</span>
                    <span>{job.location}</span>
                  </span>
                </div>

                {/* Prominently Featured Accessibility Tags */}
                <div className="space-y-2 pt-2 border-t border-stone-200/80 dark:border-stone-800/80">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-wider text-foreground/60">
                    {isHi ? "सुलभता सुविधाएं व उपकरण:" : "Accommodations & Assistive Tech:"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(job.accessibilityTags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-600/30 bg-emerald-600/10 px-2.5 py-1 text-xs font-bold text-foreground shadow-xs"
                      >
                        <span aria-hidden="true" className="text-emerald-700 dark:text-emerald-400 font-black">✓</span>
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-3 mt-auto">
                  <BigButton
                    variant={isApplied ? "secondary" : "primary"}
                    onClick={() => handleApply(job.id)}
                    className="w-full !py-2.5 !text-sm"
                  >
                    {isApplied
                      ? (isHi ? "✓ आवेदन भेजा गया" : "✓ Applied")
                      : (isHi ? "आवेदन करें →" : "Apply Now →")}
                  </BigButton>
                </div>
              </Card>
            );
          })}
        </section>
      )}
    </main>
  );
}
