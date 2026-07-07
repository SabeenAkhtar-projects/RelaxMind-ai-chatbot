"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Heart, Calendar } from "lucide-react";
import type { Language, MoodCheckinData } from "@/lib/types";
import { MOOD_LABELS, UI_TEXT } from "@/lib/types";

interface MoodTrackerProps {
  sessionId: string;
  language: Language;
}

const moodEmojis: Record<number, string> = {
  1: "😔", 2: "😞", 3: "😕", 4: "🙁", 5: "😐",
  6: "🙂", 7: "😊", 8: "😄", 9: "😁", 10: "🌟",
};

const moodColors: Record<number, string> = {
  1: "bg-red-100 border-red-400 text-red-700",
  2: "bg-red-50 border-red-300 text-red-600",
  3: "bg-orange-100 border-orange-400 text-orange-700",
  4: "bg-orange-50 border-orange-300 text-orange-600",
  5: "bg-yellow-100 border-yellow-400 text-yellow-700",
  6: "bg-yellow-50 border-yellow-300 text-yellow-600",
  7: "bg-green-50 border-green-300 text-green-600",
  8: "bg-green-100 border-green-400 text-green-700",
  9: "bg-teal-100 border-teal-400 text-teal-700",
  10: "bg-emerald-100 border-emerald-500 text-emerald-700",
};

export default function MoodTracker({ sessionId, language }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<MoodCheckinData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const t = UI_TEXT[language];
  const isRTL = language !== "en";

  useEffect(() => {
    fetchHistory();
  }, [sessionId]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/mood?sessionId=${sessionId}`);
      const data = await res.json();
      setHistory(data.checkins || []);
    } catch {
      // silently fail
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveMood = async () => {
    if (!selectedMood) return;
    setSaving(true);
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          moodScore: selectedMood,
          moodLabel: MOOD_LABELS[language][selectedMood],
          notes,
          language,
        }),
      });
      setSaved(true);
      setSelectedMood(null);
      setNotes("");
      await fetchHistory();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const avgMood = history.length
    ? Math.round((history.reduce((s, c) => s + c.moodScore, 0) / history.length) * 10) / 10
    : null;

  const formatDate = (dateStr: Date | string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "en" ? "en-PK" : "ur-PK", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <Heart className="text-teal-600" size={20} />
        </div>
        <div className={isRTL ? "text-right" : ""}>
          <h2 className={`text-lg font-bold text-teal-700 ${isRTL ? "font-urdu" : ""}`}>
            {t.moodTracker}
          </h2>
          <p className={`text-slate-500 text-sm ${isRTL ? "font-urdu" : ""}`}>
            {t.moodQuestion}
          </p>
        </div>
      </div>

      {/* Mood selector */}
      <div className="card">
        <p className={`text-slate-600 mb-4 font-medium ${isRTL ? "font-urdu text-right" : ""}`}>
          {t.moodQuestion}
        </p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
            <button
              key={score}
              onClick={() => setSelectedMood(score)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-150 ${
                selectedMood === score
                  ? moodColors[score] + " scale-110 shadow-md"
                  : "bg-slate-50 border-slate-200 hover:border-teal-300 hover:bg-teal-50"
              }`}
            >
              <span className="text-2xl">{moodEmojis[score]}</span>
              <span className="text-xs font-bold">{score}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className={`text-center mb-4 text-teal-600 font-semibold ${isRTL ? "font-urdu" : ""}`}>
            {moodEmojis[selectedMood]} {MOOD_LABELS[language][selectedMood]}
          </div>
        )}

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={language === "ur" ? "کچھ اور شیئر کرنا چاہتے ہیں؟ (اختیاری)" : language === "pa" ? "کجھ ہور شیئر کرنا چاہتے ہو؟" : language === "sd" ? "ڪجهه ٻيو شيئر ڪرڻ چاهيو ٿا؟" : "Want to share more? (optional)"}
          className={`w-full p-3 rounded-xl border border-slate-200 bg-slate-50 resize-none text-sm text-slate-700 placeholder:text-slate-400 mb-4 ${isRTL ? "font-urdu text-right" : ""}`}
          rows={3}
          dir={isRTL ? "rtl" : "ltr"}
        />

        <button
          onClick={saveMood}
          disabled={!selectedMood || saving}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            selectedMood
              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          } ${isRTL ? "font-urdu" : ""}`}
        >
          {saving
            ? "..."
            : saved
            ? language === "ur" ? "✓ محفوظ ہو گیا" : "✓ Saved"
            : t.saveMood}
        </button>
      </div>

      {/* Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="text-3xl mb-1">{avgMood !== null ? moodEmojis[Math.round(avgMood)] : "📊"}</div>
            <div className="text-2xl font-bold text-teal-600">{avgMood}</div>
            <div className={`text-slate-500 text-xs mt-1 ${isRTL ? "font-urdu" : ""}`}>
              {language === "ur" ? "اوسط موڈ" : "Avg Mood"}
            </div>
          </div>
          <div className="card text-center">
            <TrendingUp className="mx-auto text-emerald-500 mb-1" size={28} />
            <div className="text-2xl font-bold text-emerald-600">{history.length}</div>
            <div className={`text-slate-500 text-xs mt-1 ${isRTL ? "font-urdu" : ""}`}>
              {language === "ur" ? "کل ریکارڈ" : "Total Records"}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="card">
          <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Calendar className="text-teal-600" size={18} />
            <h3 className={`font-semibold text-slate-700 ${isRTL ? "font-urdu" : ""}`}>
              {language === "ur" ? "گزشتہ موڈ" : "Mood History"}
            </h3>
          </div>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {history.map((checkin) => (
              <div
                key={checkin.id}
                className={`flex items-center gap-3 p-3 rounded-xl bg-slate-50 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className="text-2xl">{moodEmojis[checkin.moodScore]}</span>
                <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                  <div className={`text-sm font-semibold text-slate-700 ${isRTL ? "font-urdu" : ""}`}>
                    {MOOD_LABELS[language][checkin.moodScore]}
                  </div>
                  <div className="text-xs text-slate-400">{formatDate(checkin.createdAt)}</div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${moodColors[checkin.moodScore]}`}>
                  {checkin.moodScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loadingHistory && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
