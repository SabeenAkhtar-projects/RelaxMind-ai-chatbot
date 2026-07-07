"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  Wind,
  Heart,
  History,
  Settings,
  Plus,
  Globe,
  Phone,
  X,
  Trash2,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import type { Language, ChatSessionData } from "@/lib/types";
import { UI_TEXT, LANGUAGE_LABELS } from "@/lib/types";

type ActiveView = "chat" | "exercises" | "mood" | "history" | "settings";

interface SidebarProps {
  language: Language;
  sessionId: string;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onNewChat: () => void;
  onLoadSession: (sessionId: number) => void;
  onLanguageChange: (lang: Language) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { view: ActiveView; icon: React.ReactNode; labelKey: string }[] = [
  { view: "chat", icon: <MessageCircle size={20} />, labelKey: "startChat" },
  { view: "exercises", icon: <Wind size={20} />, labelKey: "exercises" },
  { view: "mood", icon: <Heart size={20} />, labelKey: "moodTracker" },
  { view: "history", icon: <History size={20} />, labelKey: "history" },
  { view: "settings", icon: <Settings size={20} />, labelKey: "settings" },
];

const languages: Language[] = ["ur", "pa", "sd", "en"];

export default function Sidebar({
  language,
  sessionId,
  activeView,
  onViewChange,
  onNewChat,
  onLoadSession,
  onLanguageChange,
  isOpen,
  onClose,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSessionData[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const t = UI_TEXT[language];
  const isRTL = language !== "en";

  useEffect(() => {
    if (activeView === "history" || isOpen) {
      fetchSessions();
    }
  }, [activeView, sessionId]);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch(`/api/sessions?sessionId=${sessionId}`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      // silently fail
    } finally {
      setLoadingSessions(false);
    }
  };

  const deleteSession = async (chatSessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/sessions?chatSessionId=${chatSessionId}`, {
        method: "DELETE",
      });
      setSessions((prev) => prev.filter((s) => s.id !== chatSessionId));
    } catch {
      // silently fail
    }
  };

  const navLabels: Record<ActiveView, string> = {
    chat: t.startChat,
    exercises: t.exercises,
    mood: t.moodTracker,
    history: t.history,
    settings: t.settings,
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 ${isRTL ? "right-0" : "left-0"} z-50 lg:z-auto
          w-72 bg-gradient-to-b from-teal-700 via-teal-800 to-emerald-900 text-white
          flex flex-col transition-transform duration-300 shadow-2xl
          ${isOpen ? "translate-x-0" : isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-teal-600/50">
          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h1 className="text-lg font-bold text-white">RelaxMind</h1>
                <p className={`text-teal-300 text-xs ${isRTL ? "font-urdu" : ""}`}>
                  {t.tagline}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className={`w-full flex items-center gap-3 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-3 transition-all text-sm font-medium border border-white/20 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Plus size={18} />
            <span className={isRTL ? "font-urdu" : ""}>{t.newChat}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ view, icon, labelKey }) => (
            <button
              key={view}
              onClick={() => { onViewChange(view); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                activeView === view
                  ? "bg-white/20 text-white font-semibold shadow-sm"
                  : "text-teal-200 hover:bg-white/10 hover:text-white"
              } ${isRTL ? "flex-row-reverse text-right" : ""}`}
            >
              <span className={activeView === view ? "text-white" : "text-teal-300"}>
                {icon}
              </span>
              <span className={isRTL ? "font-urdu" : ""}>{navLabels[view]}</span>
              {activeView === view && (
                <div className={`${isRTL ? "mr-auto" : "ml-auto"} w-1.5 h-1.5 rounded-full bg-white`} />
              )}
            </button>
          ))}

          {/* Recent sessions in history */}
          {sessions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-teal-600/40">
              <p className={`text-teal-400 text-xs px-4 mb-2 ${isRTL ? "font-urdu text-right" : "uppercase tracking-wide"}`}>
                {language === "ur" ? "گزشتہ گفتگو" : "Recent Chats"}
              </p>
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => { onLoadSession(session.id); onViewChange("chat"); onClose(); }}
                >
                  <MessageCircle size={14} className="text-teal-400 flex-shrink-0" />
                  <span className={`flex-1 text-xs text-teal-200 truncate ${isRTL ? "font-urdu text-right" : ""}`}>
                    {session.title || (language === "ur" ? "گفتگو" : "Conversation")}
                  </span>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-300 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Crisis Line */}
        <div className="p-4 border-t border-teal-600/50">
          <a
            href="tel:03174288665"
            className={`flex items-center gap-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl px-4 py-3 transition-all ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Phone size={18} className="text-red-300 flex-shrink-0" />
            <div className={isRTL ? "text-right" : ""}>
              <p className={`text-red-200 text-xs font-semibold ${isRTL ? "font-urdu" : ""}`}>
                {t.crisisHelp}
              </p>
              <p className="text-red-300 text-sm font-bold">{t.crisisLine}</p>
            </div>
          </a>
        </div>

        {/* Language selector */}
        <div className="p-4 pt-0">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Globe size={14} className="text-teal-400" />
            <span className={`text-teal-400 text-xs ${isRTL ? "font-urdu" : ""}`}>
              {t.selectLanguage}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  language === lang
                    ? "bg-white text-teal-700 font-bold"
                    : "bg-white/10 text-teal-200 hover:bg-white/20"
                } ${lang !== "en" ? "font-urdu" : ""}`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
