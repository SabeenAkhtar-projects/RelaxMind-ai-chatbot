"use client";

import { useState } from "react";
import { Sparkles, Heart, Shield, Users, Globe, ChevronRight, Phone, Star } from "lucide-react";
import type { Language } from "@/lib/types";
import { UI_TEXT, LANGUAGE_LABELS } from "@/lib/types";

interface LandingPageProps {
  onGetStarted: (lang: Language) => void;
}

const languages: Language[] = ["ur", "pa", "sd", "en"];

const features = [
  {
    icon: <Heart className="text-teal-500" size={24} />,
    ur: { title: "ہمدردانہ سننا", desc: "بغیر فیصلے کے آپ کی بات سنی جائے گی" },
    en: { title: "Compassionate Listening", desc: "Heard without judgment, always" },
  },
  {
    icon: <Shield className="text-emerald-500" size={24} />,
    ur: { title: "اسلامی اصولوں پر مبنی", desc: "CBT کے ساتھ ذکر، دعا اور اسلامی خوشحالی" },
    en: { title: "Islamically Grounded", desc: "Islamic wellbeing + evidence-based CBT" },
  },
  {
    icon: <Globe className="text-blue-500" size={24} />,
    ur: { title: "آپ کی زبان میں", desc: "اردو، پنجابی، اور سندھی میں مدد دستیاب" },
    en: { title: "Your Language", desc: "Support in Urdu, Punjabi & Sindhi" },
  },
  {
    icon: <Users className="text-purple-500" size={24} />,
    ur: { title: "سب کے لیے", desc: "طلبہ، خواتین، اور نوجوانوں کے لیے" },
    en: { title: "For Everyone", desc: "Students, women, and youth across Pakistan" },
  },
];

const stats = [
  { number: "24M+", labelUr: "ذہنی صحت کے مسائل سے متاثر", labelEn: "Affected by mental disorders" },
  { number: "<500", labelUr: "پورے پاکستان میں ماہر نفسیات", labelEn: "Psychiatrists in all of Pakistan" },
  { number: "0", labelUr: "ڈاؤن لوڈ کی ضرورت", labelEn: "App downloads needed" },
];

const testimonials = [
  {
    text: "RelaxMind نے مجھے اپنی پریشانیوں سے نکلنے میں مدد کی۔ اردو میں بات کرنا بہت آسان لگا۔",
    textEn: "RelaxMind helped me through my anxiety. Talking in Urdu made it so much easier.",
    name: "Ayesha, Lahore",
    role: "University Student",
  },
  {
    text: "میں نے سوچا بھی نہیں تھا کہ کوئی ایپ میری بات اس طرح سمجھے گی۔",
    textEn: "I never thought an app would understand me this way.",
    name: "Fatima, Karachi",
    role: "Working Professional",
  },
  {
    text: "سانس لینے کی مشقوں نے میری نیند بہتر کی۔ شکریہ RelaxMind!",
    textEn: "The breathing exercises improved my sleep. Thank you RelaxMind!",
    name: "Ahmed, Islamabad",
    role: "Youth",
  },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [selectedLang, setSelectedLang] = useState<Language>("ur");
  const t = UI_TEXT[selectedLang];
  const isRTL = selectedLang !== "en";

  return (
    <div className={`min-h-screen bg-gradient-to-b from-teal-50 via-white to-emerald-50 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-sm">
        <div className={`max-w-6xl mx-auto px-4 py-4 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className={isRTL ? "text-right" : ""}>
              <span className="text-xl font-bold gradient-text">RelaxMind</span>
              <p className={`text-xs text-slate-500 ${isRTL ? "font-urdu" : ""}`}>{t.tagline}</p>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1.5 bg-teal-50 p-1 rounded-xl">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedLang === lang
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-teal-700 hover:bg-teal-100"
                } ${lang !== "en" ? "font-urdu" : ""}`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-transparent to-emerald-600/10" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <div className={`flex flex-col lg:flex-row items-center gap-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}>
            {/* Text */}
            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Sparkles size={16} />
                <span className={isRTL ? "font-urdu" : ""}>
                  {selectedLang === "ur" ? "پاکستان کا پہلا اردو AI ذہنی صحت کا ساتھی"
                    : selectedLang === "pa" ? "پاکستان دا پہلا AI ذہنی صحت دا ساتھی"
                    : selectedLang === "sd" ? "پاڪستان جو پهريون AI ذهني صحت جو ساٿي"
                    : "Pakistan's First AI Mental Health Companion"}
                </span>
              </div>

              <h1 className={`text-4xl lg:text-6xl font-bold text-slate-800 mb-4 leading-tight ${isRTL ? "font-urdu" : ""}`}>
                {t.heroTitle}
              </h1>
              <p className={`text-lg text-slate-600 mb-8 leading-relaxed max-w-xl ${isRTL ? "font-urdu" : ""}`}>
                {t.heroSubtitle}
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                <button
                  onClick={() => onGetStarted(selectedLang)}
                  className={`flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 ${isRTL ? "flex-row-reverse font-urdu" : ""}`}
                >
                  <span>{t.startChat}</span>
                  <ChevronRight size={20} className={isRTL ? "rotate-180" : ""} />
                </button>
                <a
                  href="tel:03174288665"
                  className={`flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold py-4 px-6 rounded-2xl transition-all ${isRTL ? "flex-row-reverse font-urdu" : ""}`}
                >
                  <Phone size={18} />
                  <span className="text-sm">{t.crisisHelp}</span>
                </a>
              </div>

              <p className={`text-xs text-slate-400 mt-4 ${isRTL ? "font-urdu" : ""}`}>
                {t.disclaimer}
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-80 h-80">
                {/* Background circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full" />
                <div className="absolute inset-4 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-full opacity-50" />

                {/* Center element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl shadow-2xl flex items-center justify-center rotate-12">
                    <Sparkles size={60} className="text-white -rotate-12" />
                  </div>
                </div>

                {/* Floating cards */}
                <div className={`absolute top-4 ${isRTL ? "left-0" : "right-0"} bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2`}>
                  <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Heart size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{selectedLang === "ur" ? "آپ سے مل کر خوشی ہوئی" : "Here for you"}</p>
                    <p className="text-xs text-slate-400">RelaxMind</p>
                  </div>
                </div>

                <div className={`absolute bottom-8 ${isRTL ? "right-0" : "left-0"} bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2`}>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-600">
                    {selectedLang === "ur" ? "محفوظ و قابل اعتماد" : "Safe & trusted"}
                  </p>
                </div>

                {/* Breathing animation */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-500 rounded-full breathe-circle flex items-center justify-center">
                  <span className="text-white text-2xl">🌿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-700 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className={`grid grid-cols-3 gap-4 ${isRTL ? "" : ""}`}>
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.number}</div>
                <p className={`text-teal-200 text-xs lg:text-sm ${isRTL ? "font-urdu" : ""}`}>
                  {isRTL ? stat.labelUr : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold text-slate-800 mb-3 ${isRTL ? "font-urdu" : ""}`}>
              {selectedLang === "ur" ? "RelaxMind کیوں خاص ہے؟"
                : selectedLang === "pa" ? "RelaxMind کیوں خاص اے؟"
                : selectedLang === "sd" ? "RelaxMind ڇو خاص آهي؟"
                : "Why RelaxMind is Different"}
            </h2>
            <p className={`text-slate-500 ${isRTL ? "font-urdu" : ""}`}>
              {selectedLang === "ur" ? "ثقافتی طور پر محفوظ، علمی طور پر ثابت"
                : "Culturally safe, clinically informed"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`card hover:shadow-md transition-all duration-200 flex items-start gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-slate-800 mb-1 ${isRTL ? "font-urdu" : ""}`}>
                    {isRTL ? feature.ur.title : feature.en.title}
                  </h3>
                  <p className={`text-slate-500 text-sm ${isRTL ? "font-urdu" : ""}`}>
                    {isRTL ? feature.ur.desc : feature.en.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-teal-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl font-bold text-center text-slate-800 mb-10 ${isRTL ? "font-urdu" : ""}`}>
            {selectedLang === "ur" ? "لوگوں کی آوازیں" : "What People Say"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-slate-600 text-sm mb-4 leading-relaxed ${isRTL ? "font-urdu text-right" : ""}`}>
                  &ldquo;{isRTL ? t.text : t.textEn}&rdquo;
                </p>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className="text-sm font-semibold text-slate-700">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold text-center text-slate-800 mb-10 ${isRTL ? "font-urdu" : ""}`}>
            {selectedLang === "ur" ? "ہمارے پلان" : "Our Plans"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: selectedLang === "ur" ? "بنیادی" : "Basic",
                price: selectedLang === "ur" ? "مفت" : "Free",
                features: selectedLang === "ur"
                  ? ["AI چیٹ (محدود)", "موڈ ٹریکر", "3 مشقیں"]
                  : ["AI Chat (limited)", "Mood Tracker", "3 Exercises"],
                color: "border-slate-200",
                badge: null,
              },
              {
                name: selectedLang === "ur" ? "پریمیم" : "Premium",
                price: selectedLang === "ur" ? "PKR 299/ماہ" : "PKR 299/mo",
                features: selectedLang === "ur"
                  ? ["لامحدود AI چیٹ", "تمام مشقیں", "موڈ ٹریکر", "ترقی کی رپورٹ"]
                  : ["Unlimited AI Chat", "All Exercises", "Mood Tracker", "Progress Reports"],
                color: "border-teal-500",
                badge: selectedLang === "ur" ? "مقبول" : "Popular",
              },
              {
                name: selectedLang === "ur" ? "ادارہ جاتی" : "Institutional",
                price: selectedLang === "ur" ? "PKR 15,000+/ماہ" : "PKR 15,000+/mo",
                features: selectedLang === "ur"
                  ? ["یونیورسٹی/کارپوریٹ", "HR ڈیش بورڈ", "تخصیص", "API رسائی"]
                  : ["University/Corporate", "HR Dashboard", "Customization", "API Access"],
                color: "border-emerald-500",
                badge: "B2B",
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`card border-2 ${plan.color} relative ${plan.badge ? "shadow-lg" : ""}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 ${isRTL ? "left-4" : "right-4"} bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {plan.badge}
                  </div>
                )}
                <h3 className={`font-bold text-slate-800 mb-1 ${isRTL ? "font-urdu text-right" : ""}`}>{plan.name}</h3>
                <div className={`text-2xl font-bold text-teal-600 mb-4 ${isRTL ? "font-urdu text-right" : ""}`}>{plan.price}</div>
                <ul className="space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm text-slate-600 ${isRTL ? "flex-row-reverse font-urdu" : ""}`}>
                      <span className="text-emerald-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-600 to-emerald-700 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`text-3xl font-bold text-white mb-4 ${isRTL ? "font-urdu" : ""}`}>
            {selectedLang === "ur" ? "آج ہی شروع کریں" : "Start Your Journey Today"}
          </h2>
          <p className={`text-teal-200 mb-8 ${isRTL ? "font-urdu" : ""}`}>
            {selectedLang === "ur"
              ? "مدد مانگنا طاقت کی نشانی ہے۔ آپ اکیلے نہیں ہیں۔"
              : "Seeking help is a sign of strength. You are not alone."}
          </p>
          <button
            onClick={() => onGetStarted(selectedLang)}
            className={`bg-white text-teal-700 font-bold py-4 px-10 rounded-2xl hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl active:scale-95 inline-flex items-center gap-3 ${isRTL ? "flex-row-reverse font-urdu" : ""}`}
          >
            <Sparkles size={20} />
            {t.startChat}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Sparkles size={18} className="text-teal-400" />
            <span className="text-white font-bold">RelaxMind</span>
            <span className="text-slate-500">|</span>
            <span className={`text-sm ${isRTL ? "font-urdu" : ""}`}>
              {selectedLang === "ur" ? "ذہنی صحت کا ساتھی" : "Mental Wellness Companion"}
            </span>
          </div>
          <div className="text-xs text-center">
            <p className={isRTL ? "font-urdu" : ""}>{t.disclaimer}</p>
            <p className="mt-1">Umang Helpline: 0317-4288665 | © 2025 RelaxMind</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
