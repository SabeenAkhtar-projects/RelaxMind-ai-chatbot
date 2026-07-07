import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RelaxMind — ذہنی صحت کا ساتھی",
  description:
    "Pakistan's first AI-powered mental health first-aid chatbot in Urdu, Punjabi & Sindhi. Evidence-based support with Islamic wellbeing frameworks.",
  keywords: "mental health, Pakistan, Urdu, CBT, anxiety, depression, RelaxMind",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ur" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-teal-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
