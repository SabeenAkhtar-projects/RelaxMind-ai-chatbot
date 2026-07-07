"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import AppShell from "@/components/AppShell";
import type { Language } from "@/lib/types";

function generateSessionId(): string {
  return "session_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [language, setLanguage] = useState<Language>("ur");
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Get or create a persistent session ID
    let stored = localStorage.getItem("relaxmind_session");
    if (!stored) {
      stored = generateSessionId();
      localStorage.setItem("relaxmind_session", stored);
    }
    setSessionId(stored);

    // Check if user has previously started the app
    const hasStarted = localStorage.getItem("relaxmind_started");
    const savedLang = localStorage.getItem("relaxmind_lang") as Language | null;
    if (hasStarted && savedLang) {
      setLanguage(savedLang);
      setShowApp(true);
    }
  }, []);

  const handleGetStarted = (lang: Language) => {
    setLanguage(lang);
    setShowApp(true);
    localStorage.setItem("relaxmind_started", "true");
    localStorage.setItem("relaxmind_lang", lang);
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!showApp) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <AppShell
      initialLanguage={language}
      sessionId={sessionId}
    />
  );
}
