"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Sparkles,
  MessageCircle,
  Wind,
  Heart,
  History,
  Settings,
  Globe,
  Phone,
  ChevronRight,
  Plus,
} from "lucide-react";
import type { Language, ChatSessionData } from "@/lib/types";
import { UI_TEXT, LANGUAGE_LABELS } from "@/lib/types";
import ChatInterface from "./ChatInterface";
import MoodTracker from "./MoodTracker";
import ExercisePanel from "./ExercisePanel";
import Sidebar from "./Sidebar";

type ActiveView = "chat" | "exercises" | "mood" | "history" | "settings";

interface AppShellProps {
  initialLanguage: Language;
  sessionId: string;
}

function generateSessionId(): string {
  return "session_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function AppShell({ initialLanguage, sessionId }: AppShellProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<ChatSessionData[]>([]);
  const [chatKey, setChatKey] = useState(0); // force re-render on new chat

  const t = UI_TEXT[language];
  const isRTL = language !== "en";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const handleNewChat = useCallback(() => {
    setChatSessionId(null);
    setChatKey((k) => k + 1);
    setActiveView("chat");
  }, []);

  const handleLoadSession = useCallback((sessionId: number) => {
    setChatSessionId(sessionId);
    setChatKey((k) => k + 1);
    setActiveView("chat");
  }, []);

  const handleSessionCreated = useCallback((id: number) => {
    setChatSessionId(id);
  }, []);

  const viewLabels: Record<ActiveView, string> = {
    chat: t.startChat,
    exercises: t.exercises,
    mood: t.moodTracker,
    history: t.history,
    settings: t.settings,
  };

  const viewIcons: Record<ActiveView, React.ReactNode> = {
    chat: <MessageCircle size={18} />,
    exercises: <Wind size={18} />,
    mood: <Heart size={18} />,
    history: <History size={18} />,
    settings: <Settings size={18} />,
  };

  return (
    <div className={`flex h-screen bg-teal-50 overflow-hidden ${isRTL ? "rtl" : "ltr"}`}>
      {/* Sidebar */}
      <Sidebar
        language={language}
        sessionId={sessionId}
        activeView={activeView}
        onViewChange={setActiveView}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        onLanguageChange={setLanguage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className={`bg-white border-b border-teal-100 px-4 py-3 flex items-center gap-3 shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-teal-50 rounded-xl transition-colors"
          >
            <Menu size={20} className="text-slate-600" />
          </button>

          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              {viewIcons[activeView]}
            </div>
            <h2 className={`font-semibold text-slate-700 ${isRTL ? "font-urdu" : ""}`}>
              {viewLabels[activeView]}
            </h2>
          </div>

          <div className={`${isRTL ? "mr-auto" : "ml-auto"} flex items-center gap-2`}>
            {activeView === "chat" && (
              <button
                onClick={handleNewChat}
                className={`flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-medium px-3 py-2 rounded-xl transition-all ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Plus size={16} />
                <span className={`hidden sm:block ${isRTL ? "font-urdu" : ""}`}>{t.newChat}</span>
              </button>
            )}

            {/* Language badge */}
            <div className={`hidden sm:flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs px-3 py-2 rounded-xl border border-slate-200 ${isRTL ? "flex-row-reverse font-urdu" : ""}`}>
              <Globe size={14} />
              {LANGUAGE_LABELS[language]}
            </div>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 overflow-hidden">
          {activeView === "chat" && (
            <div className="h-full flex flex-col">
              <ChatInterface
                key={chatKey}
                sessionId={sessionId}
                language={language}
                chatSessionId={chatSessionId}
                onSessionCreated={handleSessionCreated}
              />
            </div>
          )}

          {activeView === "exercises" && (
            <div className="h-full overflow-y-auto">
              <ExercisePanel sessionId={sessionId} language={language} />
            </div>
          )}

          {activeView === "mood" && (
            <div className="h-full overflow-y-auto">
              <MoodTracker sessionId={sessionId} language={language} />
            </div>
          )}

          {activeView === "history" && (
            <HistoryView
              sessionId={sessionId}
              language={language}
              onLoadSession={(id) => {
                handleLoadSession(id);
                setActiveView("chat");
              }}
            />
          )}

          {activeView === "settings" && (
            <SettingsView
              language={language}
              onLanguageChange={setLanguage}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// History View Component
function HistoryView({
  sessionId,
  language,
  onLoadSession,
}: {
  sessionId: string;
  language: Language;
  onLoadSession: (id: number) => void;
}) {
  const [sessions, setSessions] = useState<ChatSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = language !== "en";

  useEffect(() => {
    fetch(`/api/sessions?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const formatDate = (dateStr: Date | string) => {
    return new Date(dateStr).toLocaleDateString(language === "en" ? "en-PK" : "ur-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 max-w-2xl mx-auto">
      <div className={`flex items-center gap-3 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <History className="text-teal-600" size={20} />
        </div>
        <div className={isRTL ? "text-right" : ""}>
          <h2 className={`text-lg font-bold text-teal-700 ${isRTL ? "font-urdu" : ""}`}>
            {language === "ur" ? "گفتگو کی تاریخ" : "Chat History"}
          </h2>
          <p className={`text-slate-500 text-sm ${isRTL ? "font-urdu" : ""}`}>
            {language === "ur" ? "آپ کی گزشتہ گفتگوئیں" : "Your previous conversations"}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="text-center py-16">
          <MessageCircle size={48} className="text-slate-300 mx-auto mb-4" />
          <p className={`text-slate-400 ${isRTL ? "font-urdu" : ""}`}>
            {language === "ur" ? "ابھی کوئی گفتگو نہیں" : "No conversations yet"}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onLoadSession(session.id)}
            className={`w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-teal-100 hover:border-teal-300 hover:shadow-md transition-all text-left ${isRTL ? "flex-row-reverse text-right" : ""}`}
          >
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-teal-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-slate-700 truncate text-sm ${isRTL ? "font-urdu" : ""}`}>
                {session.title || (language === "ur" ? "گفتگو" : "Conversation")}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(session.createdAt)}</p>
            </div>
            <ChevronRight size={16} className={`text-slate-400 flex-shrink-0 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Settings View Component
function SettingsView({
  language,
  onLanguageChange,
}: {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}) {
  const t = UI_TEXT[language];
  const isRTL = language !== "en";
  const languages: Language[] = ["ur", "pa", "sd", "en"];

  return (
    <div className="h-full overflow-y-auto p-4 max-w-2xl mx-auto">
      <div className={`flex items-center gap-3 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <Settings className="text-teal-600" size={20} />
        </div>
        <h2 className={`text-lg font-bold text-teal-700 ${isRTL ? "font-urdu" : ""}`}>
          {t.settings}
        </h2>
      </div>

      {/* Language selection */}
      <div className="card mb-4">
        <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Globe size={18} className="text-teal-600" />
          <h3 className={`font-semibold text-slate-700 ${isRTL ? "font-urdu" : ""}`}>
            {t.selectLanguage}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                language === lang
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 hover:border-teal-300"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex-1 font-semibold ${lang !== "en" ? "font-urdu" : ""} ${isRTL ? "text-right" : ""}`}>
                {LANGUAGE_LABELS[lang]}
              </div>
              {language === lang && (
                <div className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card mb-4">
        <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Sparkles size={18} className="text-teal-600" />
          <h3 className={`font-semibold text-slate-700 ${isRTL ? "font-urdu" : ""}`}>
            {language === "ur" ? "RelaxMind کے بارے میں" : "About RelaxMind"}
          </h3>
        </div>
        <p className={`text-slate-600 text-sm leading-relaxed ${isRTL ? "font-urdu text-right" : ""}`}>
          {language === "ur"
            ? "RelaxMind پاکستان کا پہلا اردو AI ذہنی صحت کا ساتھی ہے۔ یہ تھراپی کا متبادل نہیں بلکہ پہلی مدد کا نقطہ ہے۔ ہم اسلامی اصولوں کو CBT تکنیکوں کے ساتھ ملا کر آپ کی مدد کرتے ہیں۔"
            : "RelaxMind is Pakistan's first AI mental health first-aid companion. Not a therapy replacement — a culturally safe first touchpoint combining Islamic wellbeing with evidence-based CBT."}
        </p>
      </div>

      {/* Crisis */}
      <a
        href="tel:03174288665"
        className={`card border-2 border-red-200 bg-red-50 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <Phone className="text-red-600" size={20} />
        </div>
        <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
          <p className={`font-bold text-red-700 ${isRTL ? "font-urdu" : ""}`}>{t.crisisHelp}</p>
          <p className="text-red-600 text-lg font-bold">{t.crisisLine}</p>
          <p className={`text-red-500 text-xs ${isRTL ? "font-urdu" : ""}`}>
            {language === "ur" ? "Umang ہیلپ لائن — 24/7 دستیاب" : "Umang Helpline — Available 24/7"}
          </p>
        </div>
      </a>

      <p className={`text-xs text-slate-400 text-center mt-6 ${isRTL ? "font-urdu" : ""}`}>
        {t.disclaimer}
      </p>
      <p className="text-xs text-slate-300 text-center mt-1">RelaxMind v1.0 © 2025</p>
    </div>
  );
}
