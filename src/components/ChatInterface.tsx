"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  AlertCircle,
  Phone,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import type { Language, ChatMessage } from "@/lib/types";
import { UI_TEXT } from "@/lib/types";

interface ChatInterfaceProps {
  sessionId: string;
  language: Language;
  chatSessionId: number | null;
  onSessionCreated: (id: number) => void;
}

const QUICK_MESSAGES: Record<Language, string[]> = {
  ur: [
    "میں بہت پریشان ہوں",
    "مجھے نیند نہیں آتی",
    "میں اکیلا محسوس کرتا ہوں",
    "میں تھکا ہوا ہوں",
    "سانس لینے میں مدد چاہیے",
  ],
  en: [
    "I'm feeling very anxious",
    "I can't sleep",
    "I feel lonely",
    "I'm exhausted",
    "Help me with breathing",
  ],
  pa: [
    "میں بہت پریشان آں",
    "مینوں نیند نہیں آؤندی",
    "میں اکیلا محسوس کرنا آں",
    "میں تھکیا ہویا آں",
    "سانس لین وچ مدد چاہیدی اے",
  ],
  sd: [
    "مان تمام پريشان آهيان",
    "مون کي ننڊ نه ٿي اچي",
    "مان اڪيلو محسوس ڪريان ٿو",
    "مان ٿڪل آهيان",
    "سانهن وٺڻ ۾ مدد گهرجي",
  ],
};

const WELCOME_MESSAGES: Record<Language, string> = {
  ur: "السلام علیکم! 💚\n\nمیں RelaxMind ہوں — آپ کا ذہنی صحت کا ساتھی۔ آپ کا یہاں آنا ہمت کی نشانی ہے۔\n\nمیں آپ کی بات سننے کے لیے یہاں ہوں۔ آپ کیسا محسوس کر رہے ہیں آج؟",
  en: "Assalamualaikum! 💚\n\nI'm RelaxMind — your mental wellness companion. Coming here shows real courage.\n\nI'm here to listen. How are you feeling today?",
  pa: "السلام علیکم! 💚\n\nمیں RelaxMind ہاں — تُہاڈا ذہنی صحت دا ساتھی۔ ایتھے آنا ہمت دی نشانی اے۔\n\nمیں تُہاڈی گل سُنن لئی ایتھے ہاں۔ اج تُسی کیویں محسوس کر رہے ہو؟",
  sd: "السلام عليڪم! 💚\n\nمان RelaxMind آهيان — توهان جو ذهني صحت جو ساٿي۔ هتي اچڻ همت جي نشاني آهي۔\n\nمان توهان جي ٻوليءَ ٻڌڻ لاءِ هتي آهيان۔ اڄ توهان ڪيئن محسوس ڪري رهيا آهيو؟",
};

const CRISIS_KEYWORDS = [
  "مرنا", "خودکشی", "ختم", "مر جاؤں", "suicide", "kill myself", "end it",
  "مر جانا", "جینا نہیں", "خود کو نقصان", "harm myself", "self harm",
];

function containsCrisisContent(text: string): boolean {
  return CRISIS_KEYWORDS.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));
}

const CRISIS_RESPONSE: Record<Language, string> = {
  ur: "⚠️ آپ کی بات بہت اہم ہے اور میں آپ کے لیے فکرمند ہوں۔\n\nبراہ کرم ابھی Umang ہیلپ لائن پر کال کریں:\n📞 0317-4288665\n\nآپ اکیلے نہیں ہیں۔ مدد لینا طاقت کی نشانی ہے۔ 💙",
  en: "⚠️ What you're sharing is very important and I'm concerned about you.\n\nPlease call Umang helpline right now:\n📞 0317-4288665\n\nYou are not alone. Seeking help is a sign of strength. 💙",
  pa: "⚠️ تُہاڈی گل بہت اہم اے تے مینوں تُہاڈی فکر اے۔\n\nہن ای Umang ہیلپ لائن تے کال کرو:\n📞 0317-4288665\n\nتُسی اکیلے نہیں ہو۔ 💙",
  sd: "⚠️ توهان جي ڳالهه تمام اهم آهي۔\n\nهاڻي Umang helpline تي ڪال ڪريو:\n📞 0317-4288665\n\nتوهان اڪيلا ناهيو۔ 💙",
};

export default function ChatInterface({
  sessionId,
  language,
  chatSessionId,
  onSessionCreated,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(chatSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const t = UI_TEXT[language];
  const isRTL = language !== "en";

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: WELCOME_MESSAGES[language],
          createdAt: new Date(),
        },
      ]);
    }
  }, [language]);

  useEffect(() => {
    if (chatSessionId && chatSessionId !== currentSessionId) {
      setCurrentSessionId(chatSessionId);
      loadMessages(chatSessionId);
    }
  }, [chatSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (sessionId: number) => {
    try {
      const res = await fetch(`/api/messages?chatSessionId=${sessionId}`);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        setMessages([
          {
            role: "assistant",
            content: WELCOME_MESSAGES[language],
            createdAt: new Date(),
          },
        ]);
      }
    } catch {
      // silently fail
    }
  };

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = text || input.trim();
      if (!messageText || isLoading) return;

      setInput("");

      // Check for crisis content
      if (containsCrisisContent(messageText)) {
        setShowCrisis(true);
        const crisisMsg: ChatMessage = {
          role: "assistant",
          content: CRISIS_RESPONSE[language],
          createdAt: new Date(),
        };
        setMessages((prev) => [
          ...prev,
          { role: "user", content: messageText, createdAt: new Date() },
          crisisMsg,
        ]);
        return;
      }

      const userMsg: ChatMessage = {
        role: "user",
        content: messageText,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText,
            sessionId,
            language,
            chatSessionId: currentSessionId,
          }),
        });

        const data = await res.json();

        if (data.chatSessionId && !currentSessionId) {
          setCurrentSessionId(data.chatSessionId);
          onSessionCreated(data.chatSessionId);
        }

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.response || data.error || "معذرت، دوبارہ کوشش کریں۔",
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              language === "ur"
                ? "معذرت، ابھی مشکل ہو رہی ہے۔ دوبارہ کوشش کریں۔"
                : "Sorry, having trouble right now. Please try again.",
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, sessionId, language, currentSessionId, onSessionCreated]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: WELCOME_MESSAGES[language],
        createdAt: new Date(),
      },
    ]);
    setCurrentSessionId(null);
    setShowCrisis(false);
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Crisis Alert Banner */}
      {showCrisis && (
        <div className={`bg-red-50 border-b border-red-200 p-3 flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
            <p className={`text-red-700 text-sm font-semibold ${isRTL ? "font-urdu" : ""}`}>
              {language === "ur" ? "فوری مدد دستیاب ہے" : "Immediate Help Available"}
            </p>
          </div>
          <a
            href="tel:03174288665"
            className={`flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Phone size={12} />
            <span>0317-4288665</span>
          </a>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              msg.role === "user"
                ? isRTL ? "flex-row" : "flex-row-reverse"
                : isRTL ? "flex-row-reverse" : "flex-row"
            } msg-${msg.role === "user" ? "out" : "in"}`}
          >
            {/* Avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mb-1">
                <Sparkles size={14} className="text-white" />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-tr-sm"
                  : "bg-white text-slate-800 rounded-tl-sm shadow-sm border border-teal-100"
              } ${isRTL ? "text-right" : "text-left"}`}
            >
              <p
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  isRTL ? "font-urdu" : ""
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {formatMessage(msg.content)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className={`flex items-end gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-teal-100">
              <div className="flex gap-1.5 items-center">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {messages.length <= 1 && (
        <div className={`px-4 pb-2 flex gap-2 flex-wrap ${isRTL ? "justify-end" : ""}`}>
          {QUICK_MESSAGES[language].map((msg, i) => (
            <button
              key={i}
              onClick={() => sendMessage(msg)}
              className={`text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-full transition-all ${isRTL ? "font-urdu" : ""}`}
            >
              {msg}
            </button>
          ))}
        </div>
      )}

      {/* Crisis helpline mini banner */}
      <div className={`mx-4 mb-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <p className={`text-xs text-red-600 font-medium ${isRTL ? "font-urdu" : ""}`}>
          {language === "ur" ? "بحران؟ ابھی مدد لیں" : "Crisis? Get help now"}
        </p>
        <a href="tel:03174288665" className="text-xs font-bold text-red-600 flex items-center gap-1">
          <Phone size={11} />
          0317-4288665
        </a>
      </div>

      {/* Input area */}
      <div className="p-4 pt-0">
        <div className={`flex items-end gap-2 bg-white rounded-2xl border-2 border-teal-200 focus-within:border-teal-500 p-2 transition-all shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}>
          <button
            onClick={resetChat}
            className="p-2 text-slate-400 hover:text-teal-600 transition-colors flex-shrink-0"
            title={t.newChat}
          >
            <RefreshCw size={18} />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.typeMessage}
            dir={isRTL ? "rtl" : "ltr"}
            className={`flex-1 bg-transparent resize-none text-slate-700 placeholder:text-slate-400 text-sm py-1 max-h-32 ${isRTL ? "font-urdu text-right" : ""}`}
            rows={1}
            style={{ outline: "none", border: "none", boxShadow: "none" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ${
              input.trim() && !isLoading
                ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className={`text-xs text-slate-400 text-center mt-2 ${isRTL ? "font-urdu" : ""}`}>
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
}
