"use client";
// Accessible, Feature-Rich Learn screen for Ekak: displays accessible courses with ISL, screen reader, and captions support

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
      } catch (_) {
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
    <main className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8 animate-fade-up">
      {/* 1. Header with Feature Highlights */}
      <section className="space-y-4">
        <PageTitle
          badge={isHi ? "सुलभ शिक्षा • एकाक" : "Accessible Learning • Ekak"}
          title={isHi ? "सुलभ शिक्षा और डिजिटल कौशल" : "Inclusive Courses & Upskilling"}
          subtitle={
            mode.simpleText
              ? (isHi ? "व्यावहारिक और आसान डिजिटल कोर्सेज सीखें।" : "Explore practical courses with assistive tools.")
              : (isHi
                ? "भारतीय सांकेतिक भाषा (ISL), स्क्रीन रीडर और सरल भाषा में तैयार किए गए निःशुल्क कोर्सेज से नए डिजिटल कौशल सीखें।"
                : "Free self-paced courses designed from the ground up for Indian Sign Language (ISL), screen reader navigation, and audio captions.")
          }
        />

        {/* Learning Perks Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "🤟", titleHi: "ISL वीडियो ट्रैक", titleEn: "ISL Video Track" },
            { icon: "🦻", titleHi: "लाइव कैप्शन्स", titleEn: "Captions Included" },
            { icon: "📜", titleHi: "निःशुल्क सर्टिफिकेट", titleEn: "Free Certificate" },
            { icon: "⚡", titleHi: "स्व-गति से सीखें", titleEn: "Self-Paced" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 rounded-2xl border border-stone-200/90 dark:border-stone-800/90 bg-card p-3 shadow-xs">
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="text-xs font-black text-foreground truncate">{isHi ? item.titleHi : item.titleEn}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Enrollment Success Announcement */}
      {enrolledCourseId && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-emerald-600 bg-emerald-600/15 p-4 font-bold text-foreground shadow-sm animate-fade-up"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl">🎉</span>
            <span className="text-sm sm:text-base font-extrabold">
              {isHi
                ? "आप कोर्स में सफलतापूर्वक नामांकित हो गए हैं! वीडियो और अध्ययन सामग्री अनलॉक हो गई है।"
                : "You have successfully enrolled in this course! All learning materials are unlocked."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEnrolledCourseId(null)}
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
          className="flex min-h-[14rem] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-stone-200/90 dark:border-stone-700/90 bg-card p-8 text-center seva-card"
        >
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-blue-700 border-t-transparent" />
          <p className="text-base font-extrabold text-foreground">
            {isHi ? "सुलभ कोर्सेज लोड हो रहे हैं..." : "Loading accessible courses..."}
          </p>
        </div>
      )}

      {/* 4. Error State */}
      {error && !loading && (
        <div
          role="alert"
          className="rounded-3xl border-2 border-rose-500 bg-rose-500/10 p-6 text-center text-rose-700 dark:text-rose-400 space-y-3 shadow-xs"
        >
          <p className="text-base font-extrabold">{error}</p>
          <BigButton variant="danger" onClick={() => window.location.reload()} className="!min-h-[44px] !text-sm">
            {isHi ? "पुनः प्रयास करें" : "Retry"}
          </BigButton>
        </div>
      )}

      {/* 5. Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div
          role="status"
          className="rounded-3xl border-2 border-stone-200/90 dark:border-stone-700/90 bg-card p-10 text-center space-y-3 seva-card"
        >
          <span aria-hidden="true" className="text-4xl">📚</span>
          <p className="text-lg font-extrabold">
            {isHi ? "वर्तमान में कोई कोर्स उपलब्ध नहीं है।" : "No courses available right now."}
          </p>
        </div>
      )}

      {/* 6. Courses Grid */}
      {!loading && !error && courses.length > 0 && (
        <section aria-label="Available Courses" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseId === course.id;
            const langLabel =
              course.language === "hi"
                ? (isHi ? "हिन्दी • ISL सांकेतिक" : "Hindi • ISL Track")
                : (isHi ? "English • Captions" : "English • Captions");

            return (
              <Card
                key={course.id}
                as="article"
                icon="🎓"
                accentColor="blue"
                title={course.title}
                badge={langLabel}
                className="h-full shadow-sm"
              >
                {/* Course Metadata Strip */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-foreground/70">
                  <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 dark:bg-stone-800/80 px-2 py-0.5 text-[0.7rem]">
                    ⏱️ {isHi ? "4 सप्ताह" : "4 Weeks"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-[0.7rem]">
                    📜 {isHi ? "निःशुल्क" : "Free"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-foreground/85 font-medium leading-relaxed">
                  {course.description}
                </p>

                {/* Accessible features detail (hidden in Simple Text Mode) */}
                <div className="optional-detail pt-3 border-t border-stone-200/80 dark:border-stone-800/80 text-xs font-semibold text-foreground/75 space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-blue-700 dark:text-blue-400 font-extrabold shrink-0" aria-hidden="true">✓</span>
                    <span>{isHi ? "स्क्रीन रीडर व कीबोर्ड-अनुकूल" : "Screen reader & keyboard accessible"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-700 dark:text-blue-400 font-extrabold shrink-0" aria-hidden="true">✓</span>
                    <span>{isHi ? "भारतीय सांकेतिक भाषा (ISL)" : "Indian Sign Language (ISL) video track"}</span>
                  </p>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-3 mt-auto">
                  <BigButton
                    variant={isEnrolled ? "secondary" : "primary"}
                    onClick={() => handleEnroll(course.id)}
                    className="w-full !py-2.5 !text-sm"
                  >
                    {isEnrolled
                      ? (isHi ? "✓ नामांकित (जारी रखें)" : "✓ Enrolled (Continue)")
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
