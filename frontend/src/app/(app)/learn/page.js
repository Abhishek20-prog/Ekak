"use client";
// Accessible Learn screen: displays accessible courses from getCourses() with ISL, screen reader, and captions support

import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile";
import { getCourses } from "@/lib/api";
import { PageTitle, Card, BigButton } from "@/components/ui";

export default function LearnPage() {
  const { profile } = useProfile();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolledCourseId, setEnrolledCourseId] = useState(null);

  const { mode, language } = profile;
  const isHi = language === "hi";

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const data = await getCourses();
        if (isMounted) setCourses(data);
      } catch (err) {
        if (isMounted) setError("Failed to load courses. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnroll = (courseId) => {
    setEnrolledCourseId(courseId);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 sm:space-y-9 p-4 sm:p-6 lg:p-8 animate-fade-up">
      {/* 1. Header */}
      <PageTitle
        badge={isHi ? "सुलभ शिक्षा" : "Accessible Learning"}
        title={isHi ? "सुलभ शिक्षा और कोर्सेज" : "Inclusive Courses & Upskilling"}
        subtitle={
          mode.simpleText
            ? (isHi ? "व्यावहारिक और आसान कोर्सेज सीखें।" : "Explore practical courses with assistive tools.")
            : (isHi
                ? "साइन लैंग्वेज, स्क्रीन रीडर और आसान भाषा में तैयार किए गए कोर्सेज से नए डिजिटल कौशल सीखें।"
                : "Free self-paced courses designed from the ground up for Indian Sign Language (ISL), screen reader navigation, and audio captions.")
        }
      />

      {/* 2. Enrollment Success Live Announcement */}
      {enrolledCourseId && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 p-3.5 sm:p-4 font-bold text-foreground"
        >
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="text-xl">🎉</span>
            <span className="text-sm sm:text-base">
              {isHi
                ? "आप कोर्स में सफलतापूर्वक नामांकित हो गए हैं! (Enrolled)"
                : "You have successfully enrolled in this course! Learning materials unlocked."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEnrolledCourseId(null)}
            className="rounded-lg p-1 text-xs sm:text-sm underline hover:opacity-80 focus-visible:outline focus-visible:outline-2 cursor-pointer"
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
          className="flex min-h-[14rem] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-card p-6 text-center seva-card"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-600 border-t-transparent" />
          <p className="text-base font-bold text-foreground">
            {isHi ? "कोर्सेज लोड हो रहे हैं..." : "Loading accessible courses..."}
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

      {/* 5. Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div
          role="status"
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-card p-8 text-center space-y-2 seva-card"
        >
          <span aria-hidden="true" className="text-3xl">📚</span>
          <p className="text-lg font-bold">
            {isHi ? "वर्तमान में कोई कोर्स उपलब्ध नहीं है।" : "No courses available right now."}
          </p>
        </div>
      )}

      {/* 6. Courses Grid */}
      {!loading && !error && courses.length > 0 && (
        <section aria-label="Available Courses" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseId === course.id;
            const langLabel =
              course.language === "hi"
                ? (isHi ? "हिन्दी • ISL" : "Hindi • ISL")
                : (isHi ? "English • Captions" : "English • Captions");

            return (
              <Card
                key={course.id}
                as="article"
                icon="🎓"
                accentColor="indigo"
                title={course.title}
                badge={langLabel}
                className="flex flex-col justify-between"
              >
                <p className="text-sm sm:text-base text-foreground/80 font-normal leading-relaxed">
                  {course.description}
                </p>

                {/* Accessible features detail (hidden in Simple Text Mode) */}
                <div className="optional-detail pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm font-medium text-foreground/65 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold" aria-hidden="true">✓</span>
                    <span>{isHi ? "स्क्रीन रीडर व कीबोर्ड-अनुकूल" : "Screen reader & keyboard accessible"}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold" aria-hidden="true">✓</span>
                    <span>{isHi ? "भारतीय सांकेतिक भाषा (ISL)" : "Indian Sign Language (ISL) video track"}</span>
                  </p>
                </div>

                <div className="pt-4 mt-auto">
                  <BigButton
                    variant={isEnrolled ? "secondary" : "primary"}
                    onClick={() => handleEnroll(course.id)}
                    className="w-full"
                  >
                    {isEnrolled
                      ? (isHi ? "✓ नामांकित (Continue)" : "✓ Enrolled (Continue)")
                      : (isHi ? "कोर्स शुरू करें →" : "Start Course →")}
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
