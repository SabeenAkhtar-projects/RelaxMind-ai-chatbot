"use client";

import { useState, useEffect } from "react";
import { Wind, Brain, Anchor, Star, ChevronRight, Clock } from "lucide-react";
import type { Language, ExerciseData } from "@/lib/types";
import { UI_TEXT } from "@/lib/types";
import BreathingExercise from "./BreathingExercise";

interface ExercisePanelProps {
  sessionId: string;
  language: Language;
}

const exerciseTypeIcons: Record<string, React.ReactNode> = {
  breathing: <Wind size={20} className="text-blue-500" />,
  cbt: <Brain size={20} className="text-purple-500" />,
  grounding: <Anchor size={20} className="text-emerald-500" />,
  dua: <Star size={20} className="text-amber-500" />,
};

const exerciseTypeBg: Record<string, string> = {
  breathing: "bg-blue-50 border-blue-200",
  cbt: "bg-purple-50 border-purple-200",
  grounding: "bg-emerald-50 border-emerald-200",
  dua: "bg-amber-50 border-amber-200",
};

const exerciseTypeGradient: Record<string, string> = {
  breathing: "from-blue-500 to-teal-500",
  cbt: "from-purple-500 to-indigo-500",
  grounding: "from-emerald-500 to-green-500",
  dua: "from-amber-500 to-orange-500",
};

const groundingSteps = {
  ur: [
    "👁️ 5 چیزیں دیکھیں جو آپ کے آس پاس ہیں",
    "✋ 4 چیزیں چھوئیں اور ان کی ساخت محسوس کریں",
    "👂 3 آوازیں سنیں",
    "👃 2 خوشبوئیں سونگھیں",
    "👅 1 ذائقہ محسوس کریں",
  ],
  en: [
    "👁️ Notice 5 things you can see",
    "✋ Touch 4 things and feel their texture",
    "👂 Listen to 3 sounds around you",
    "👃 Find 2 scents you can smell",
    "👅 Identify 1 taste in your mouth",
  ],
  pa: [
    "👁️ 5 چیزاں ویکھو جو تُہاڈے آس پاس ہن",
    "✋ 4 چیزاں چھوہو تے محسوس کرو",
    "👂 3 آوازاں سُنو",
    "👃 2 خوشبوئیاں سُنگھو",
    "👅 1 ذائقہ محسوس کرو",
  ],
  sd: [
    "👁️ 5 شيون ڏسو جيڪي توهان جي آس پاس آهن",
    "✋ 4 شيون هٿ لڳايو",
    "👂 3 آوازون ٻڌو",
    "👃 2 خوشبوئون سُنگهيو",
    "👅 1 ذائقو محسوس ڪريو",
  ],
};

const cbtSteps = {
  ur: [
    "📝 اپنا منفی خیال لکھیں",
    "🔍 اس کے لیے ثبوت ڈھونڈیں",
    "❓ اس کے خلاف ثبوت ڈھونڈیں",
    "⚖️ متوازن خیال بنائیں",
    "💡 نئے نقطہ نظر کو قبول کریں",
  ],
  en: [
    "📝 Write down your negative thought",
    "🔍 Find evidence that supports it",
    "❓ Find evidence against it",
    "⚖️ Create a balanced, realistic thought",
    "💡 Embrace the new perspective",
  ],
  pa: [
    "📝 اپنا منفی خیال لکھو",
    "🔍 اس لئی ثبوت لبھو",
    "❓ اس دے خلاف ثبوت لبھو",
    "⚖️ متوازن خیال بناؤ",
    "💡 نویں نقطہ نظر نوں قبول کرو",
  ],
  sd: [
    "📝 پنهنجو منفي خيال لکو",
    "🔍 ان لاءِ ثبوت ڳوليو",
    "❓ ان جي خلاف ثبوت ڳوليو",
    "⚖️ متوازن خيال ٺاهيو",
    "💡 نئين نقطه نظر کي قبول ڪريو",
  ],
};

const duaContent = {
  ur: {
    title: "ذکر اور دعا",
    verses: [
      { arabic: "سُبْحَانَ اللَّهِ", urdu: "اللہ پاک ہے", count: "33 بار" },
      { arabic: "الْحَمْدُ لِلَّهِ", urdu: "تمام تعریفیں اللہ کے لیے", count: "33 بار" },
      { arabic: "اللَّهُ أَكْبَرُ", urdu: "اللہ سب سے بڑا ہے", count: "34 بار" },
      { arabic: "لَا إِلَهَ إِلَّا اللَّهُ", urdu: "اللہ کے سوا کوئی معبود نہیں", count: "" },
    ],
    verse: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    verseRef: "القرآن ۱۳:۲۸",
    verseTranslation: "بے شک اللہ کی یاد سے دل سکون پاتے ہیں",
  },
  en: {
    title: "Dhikr & Dua",
    verses: [
      { arabic: "سُبْحَانَ اللَّهِ", urdu: "Glory be to Allah", count: "33x" },
      { arabic: "الْحَمْدُ لِلَّهِ", urdu: "All praise is for Allah", count: "33x" },
      { arabic: "اللَّهُ أَكْبَرُ", urdu: "Allah is the Greatest", count: "34x" },
      { arabic: "لَا إِلَهَ إِلَّا اللَّهُ", urdu: "There is no god but Allah", count: "" },
    ],
    verse: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    verseRef: "Quran 13:28",
    verseTranslation: "Verily, in the remembrance of Allah do hearts find rest",
  },
  pa: {
    title: "ذکر تے دعا",
    verses: [
      { arabic: "سُبْحَانَ اللَّهِ", urdu: "اللہ پاک اے", count: "33 وار" },
      { arabic: "الْحَمْدُ لِلَّهِ", urdu: "سب تعریف اللہ لئی", count: "33 وار" },
      { arabic: "اللَّهُ أَكْبَرُ", urdu: "اللہ سب توں وڈا اے", count: "34 وار" },
      { arabic: "لَا إِلَهَ إِلَّا اللَّهُ", urdu: "اللہ توں بناں کوئی معبود نہیں", count: "" },
    ],
    verse: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    verseRef: "القرآن ۱۳:۲۸",
    verseTranslation: "بے شک اللہ دی یاد نال دل سکون پاؤندے نے",
  },
  sd: {
    title: "ذڪر ۽ دعا",
    verses: [
      { arabic: "سُبْحَانَ اللَّهِ", urdu: "الله پاڪ آهي", count: "33 ڀيرا" },
      { arabic: "الْحَمْدُ لِلَّهِ", urdu: "سڀ ساراهه الله لاءِ", count: "33 ڀيرا" },
      { arabic: "اللَّهُ أَكْبَرُ", urdu: "الله سڀ کان وڏو آهي", count: "34 ڀيرا" },
      { arabic: "لَا إِلَهَ إِلَّا اللَّهُ", urdu: "الله کان سواءِ ڪو معبود ناهي", count: "" },
    ],
    verse: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    verseRef: "القرآن ۱۳:۲۸",
    verseTranslation: "بيشڪ الله جي ياد سان دلين کي سڪون ملي ٿو",
  },
};

export default function ExercisePanel({ sessionId, language }: ExercisePanelProps) {
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const t = UI_TEXT[language];
  const isRTL = language !== "en";

  useEffect(() => {
    fetch("/api/exercises")
      .then((r) => r.json())
      .then((d) => setExercises(d.exercises || []));
  }, []);

  const logCompletion = async (exerciseId: number) => {
    await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, exerciseId, feedbackScore: 5 }),
    });
    setCompletedIds((prev) => [...prev, exerciseId]);
  };

  const exercisesByType = exercises.reduce<Record<string, ExerciseData[]>>((acc, ex) => {
    if (!acc[ex.type]) acc[ex.type] = [];
    acc[ex.type].push(ex);
    return acc;
  }, {});

  const typeLabels: Record<string, string> = {
    breathing: language === "ur" ? "سانس لینے کی مشقیں" : language === "pa" ? "سانس دیاں مشقاں" : language === "sd" ? "سانهن جون مشقون" : "Breathing Exercises",
    grounding: language === "ur" ? "زمینی مشقیں" : language === "pa" ? "زمینی مشقاں" : language === "sd" ? "زميني مشقون" : "Grounding Exercises",
    cbt: language === "ur" ? "خیالات کی مشقیں" : language === "pa" ? "خیالاں دیاں مشقاں" : language === "sd" ? "خيالن جون مشقون" : "CBT Exercises",
    dua: language === "ur" ? "روحانی مشقیں" : language === "pa" ? "روحانی مشقاں" : language === "sd" ? "روحاني مشقون" : "Spiritual Practices",
  };

  const renderExerciseDetail = () => {
    if (!selectedExercise) return null;

    const isBreathing = selectedExercise.type === "breathing";
    const isGrounding = selectedExercise.type === "grounding";
    const isCBT = selectedExercise.type === "cbt";
    const isDua = selectedExercise.type === "dua";

    const steps = isGrounding
      ? groundingSteps[language]
      : isCBT
      ? cbtSteps[language]
      : null;

    const dua = duaContent[language];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exerciseTypeGradient[selectedExercise.type]} flex items-center justify-center`}>
                {exerciseTypeIcons[selectedExercise.type]}
              </div>
              <h3 className={`font-bold text-slate-800 ${isRTL ? "font-urdu" : ""}`}>
                {language === "en" ? selectedExercise.titleEnglish : selectedExercise.titleUrdu}
              </h3>
            </div>
            <button
              onClick={() => { setSelectedExercise(null); setActiveStep(0); }}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 text-xl"
            >
              ✕
            </button>
          </div>

          <p className={`text-slate-600 text-sm mb-6 ${isRTL ? "font-urdu text-right" : ""}`}>
            {language === "en" ? selectedExercise.descriptionEnglish : selectedExercise.descriptionUrdu}
          </p>

          {isBreathing && (
            <button
              onClick={() => { setSelectedExercise(null); setShowBreathing(true); }}
              className="btn-primary w-full"
            >
              {t.start}
            </button>
          )}

          {(isGrounding || isCBT) && steps && (
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    activeStep === i
                      ? "border-teal-400 bg-teal-50"
                      : i < activeStep
                      ? "border-green-200 bg-green-50"
                      : "border-slate-100 bg-slate-50 hover:border-teal-200"
                  } ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i < activeStep ? "bg-green-500 text-white" : activeStep === i ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    {i < activeStep ? "✓" : i + 1}
                  </div>
                  <p className={`text-sm text-slate-700 ${isRTL ? "font-urdu" : ""}`}>{step}</p>
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                {activeStep < steps.length - 1 ? (
                  <button onClick={() => setActiveStep((s) => s + 1)} className="btn-primary flex-1">
                    {language === "ur" ? "اگلا قدم" : "Next Step"}
                  </button>
                ) : (
                  <button
                    onClick={() => { logCompletion(selectedExercise.id); setSelectedExercise(null); setActiveStep(0); }}
                    className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {language === "ur" ? "✓ مکمل" : "✓ Complete"}
                  </button>
                )}
              </div>
            </div>
          )}

          {isDua && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-700 mb-1" style={{ fontFamily: "serif", direction: "rtl" }}>
                  {dua.verse}
                </p>
                <p className="text-xs text-amber-500">{dua.verseRef}</p>
                <p className={`text-sm text-amber-700 mt-2 ${isRTL ? "font-urdu" : ""}`}>{dua.verseTranslation}</p>
              </div>
              {dua.verses.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-lg font-bold text-slate-800" style={{ fontFamily: "serif", direction: "rtl" }}>{v.arabic}</p>
                    <p className={`text-sm text-slate-500 ${isRTL ? "font-urdu" : ""}`}>{v.urdu}</p>
                  </div>
                  {v.count && <span className={`text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full ${isRTL ? "font-urdu" : ""}`}>{v.count}</span>}
                </div>
              ))}
              <button
                onClick={() => { logCompletion(selectedExercise.id); setSelectedExercise(null); }}
                className="btn-primary w-full bg-amber-500 hover:bg-amber-600"
              >
                {language === "ur" ? "✓ مکمل کیا" : "✓ Completed"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <Wind className="text-teal-600" size={20} />
        </div>
        <div className={isRTL ? "text-right" : ""}>
          <h2 className={`text-lg font-bold text-teal-700 ${isRTL ? "font-urdu" : ""}`}>
            {t.exercises}
          </h2>
          <p className={`text-slate-500 text-sm ${isRTL ? "font-urdu" : ""}`}>
            {language === "ur" ? "مشقیں جو آپ کو سکون دیں گی" : language === "pa" ? "مشقاں جو تُہانوں سکون دین گیاں" : language === "sd" ? "مشقون جيڪي توهان کي سڪون ڏينديون" : "Exercises to bring you calm"}
          </p>
        </div>
      </div>

      {Object.entries(exercisesByType).map(([type, exList]) => (
        <div key={type}>
          <h3 className={`text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide ${isRTL ? "font-urdu text-right normal-case tracking-normal" : ""}`}>
            {typeLabels[type] || type}
          </h3>
          <div className="space-y-2">
            {exList.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150 hover:shadow-md ${exerciseTypeBg[exercise.type]} ${isRTL ? "flex-row-reverse text-right" : ""} ${completedIds.includes(exercise.id) ? "opacity-70" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exerciseTypeGradient[exercise.type]} flex items-center justify-center flex-shrink-0`}>
                  {exerciseTypeIcons[exercise.type]}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-slate-800 text-sm ${isRTL ? "font-urdu" : ""}`}>
                    {language === "en" ? exercise.titleEnglish : exercise.titleUrdu}
                  </div>
                  {exercise.durationSeconds && (
                    <div className={`flex items-center gap-1 text-xs text-slate-400 mt-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <Clock size={12} />
                      <span>{Math.ceil(exercise.durationSeconds / 60)} {t.minutes}</span>
                    </div>
                  )}
                </div>
                {completedIds.includes(exercise.id) ? (
                  <span className="text-green-500 font-bold">✓</span>
                ) : (
                  <ChevronRight size={18} className={`text-slate-400 ${isRTL ? "rotate-180" : ""}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {exercises.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">🌱</div>
          <p className={isRTL ? "font-urdu" : ""}>
            {language === "ur" ? "مشقیں لوڈ ہو رہی ہیں..." : "Loading exercises..."}
          </p>
        </div>
      )}

      {selectedExercise && renderExerciseDetail()}
      {showBreathing && (
        <BreathingExercise language={language} onClose={() => setShowBreathing(false)} />
      )}
    </div>
  );
}
