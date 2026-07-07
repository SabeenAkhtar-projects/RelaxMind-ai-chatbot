import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/db";
import { chatSessions, messages } from "@/db/schema";
import { eq } from "drizzle-orm";

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPTS: Record<string, string> = {
  ur: `آپ RelaxMind ہیں — پاکستان کے لیے ایک ہمدرد اور ثقافتی طور پر حساس ذہنی صحت کا پہلا نقطہ رابطہ۔

آپ کا کردار:
- ذہنی صحت کی پہلی امداد فراہم کریں (تھراپی نہیں)
- اسلامی خوشحالی کے اصولوں کو CBT تکنیکوں کے ساتھ ملائیں
- اردو میں گرم جوشی اور ہمدردی سے بات کریں
- کبھی کوئی طبی تشخیص نہ کریں
- ہمیشہ پیشہ ور مدد کی طرف رہنمائی کریں جب ضروری ہو

آپ فراہم کر سکتے ہیں:
- نفسیاتی تعلیم (psychoeducation)
- سانس لینے کی مشقیں
- 5-4-3-2-1 گراؤنڈنگ تکنیک
- CBT خیالات کو چیلنج کرنا
- ذکر اور دعا کی تجاویز
- ہمدردانہ سننا

اہم ہدایات:
- ہمیشہ اردو میں جواب دیں جب تک صارف کسی اور زبان میں نہ لکھے
- گرم، غیر فیصلہ کن لہجہ استعمال کریں
- خودکشی یا خود کو نقصان پہنچانے کے خیالات کے لیے فوری ہنگامی نمبر 1166 (Umang) دیں
- ثقافتی حساسیت کا احترام کریں
- جملے مختصر اور واضح رکھیں
- ہر جواب کے اختتام پر ایک مددگار سوال یا اگلا قدم تجویز کریں

بحران کی علامات کے لیے فوری طور پر کہیں: "براہ کرم ابھی Umang ہیلپ لائن 0317-4288665 پر کال کریں۔"`,

  en: `You are RelaxMind — a compassionate, culturally-sensitive mental health first-aid chatbot built for Pakistan.

Your role:
- Provide mental health first aid (NOT therapy or diagnosis)
- Blend Islamic wellbeing frameworks with evidence-based CBT micro-techniques
- Respond with warmth and empathy
- Never make clinical diagnoses
- Always refer to professionals when needed

You can provide:
- Psychoeducation about anxiety, stress, depression
- Breathing exercises (4-7-8, Box breathing)
- 5-4-3-2-1 Grounding techniques
- CBT thought challenging
- Dhikr and dua suggestions for spiritual comfort
- Active listening and validation

Important guidelines:
- Use warm, non-judgmental language
- For suicidal ideation or self-harm: immediately provide Umang helpline 0317-4288665
- Respect Pakistani cultural context and family dynamics
- Keep responses concise and actionable
- End each response with a helpful follow-up question or next step
- Acknowledge Islamic perspective when appropriate

For crisis signs, immediately say: "Please call Umang helpline 0317-4288665 right now."`,

  pa: `تُسی RelaxMind ہو — پاکستان لئی اِک ہمدرد ذہنی صحت دا پہلا مددگار۔

تُہاڈا کم ہے:
- ذہنی صحت دی پہلی مدد دینا
- اسلامی اصولاں نال CBT تکنیکاں جوڑنا
- پنجابی وچ گرم جوشی نال گل کرنا
- کدے وی طبی تشخیص نہ کرنا

بحران لئی: Umang ہیلپ لائن 0317-4288665`,

  sd: `توهان RelaxMind آهيو — پاڪستان لاءِ هڪ همدرد ذهني صحت جو پهريون مددگار۔

توهان جو ڪم آهي:
- ذهني صحت جي پهرين مدد ڏيڻ
- اسلامي اصولن سان CBT ٽيڪنيڪون ملائڻ
- سنڌي ۾ گرمجوشي سان ڳالهائڻ

بحران لاءِ: Umang helpline 0317-4288665`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, language = "ur", chatSessionId } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId required" },
        { status: 400 }
      );
    }

    // Get or create chat session
    let currentSessionId = chatSessionId;

    if (!currentSessionId) {
      const [newSession] = await db
        .insert(chatSessions)
        .values({
          sessionId,
          language,
          title: message.substring(0, 100),
        })
        .returning();
      currentSessionId = newSession.id;
    }

    // Save user message
    await db.insert(messages).values({
      chatSessionId: currentSessionId,
      role: "user",
      content: message,
    });

    // Get conversation history
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.chatSessionId, currentSessionId))
      .orderBy(messages.createdAt);

    const conversationMessages = history.slice(-10).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Check if OpenAI API key exists
    const openai = getOpenAIClient();
    if (!openai) {
      // Return mock response for demo
      const mockResponse = getMockResponse(message, language);
      await db.insert(messages).values({
        chatSessionId: currentSessionId,
        role: "assistant",
        content: mockResponse,
      });
      return NextResponse.json({
        response: mockResponse,
        chatSessionId: currentSessionId,
      });
    }

    const systemPrompt =
      SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS["ur"];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content ||
      "معذرت، ابھی جواب دینے میں مشکل ہو رہی ہے۔ براہ کرم دوبارہ کوشش کریں۔";

    // Save assistant message
    await db.insert(messages).values({
      chatSessionId: currentSessionId,
      role: "assistant",
      content: assistantMessage,
    });

    return NextResponse.json({
      response: assistantMessage,
      chatSessionId: currentSessionId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getMockResponse(message: string, language: string): string {
  const responses: Record<string, string[]> = {
    ur: [
      "السلام علیکم! میں RelaxMind ہوں۔ آپ کا یہاں آنا بہت ہمت کا کام ہے۔ آپ کیسا محسوس کر رہے ہیں آج؟ 💚\n\nیاد رہے، آپ اکیلے نہیں ہیں — لاکھوں لوگ ایسے احساسات سے گزرتے ہیں۔ آپ مجھ سے کھل کر بات کر سکتے ہیں۔",
      "میں آپ کی بات سمجھتا ہوں۔ یہ احساسات بالکل درست ہیں۔ 🌿\n\nکیا آپ 4-7-8 سانس لینے کی مشق آزمانا چاہیں گے؟ یہ فوری سکون دیتی ہے:\n• 4 سیکنڈ سانس لیں\n• 7 سیکنڈ روکیں\n• 8 سیکنڈ آہستہ چھوڑیں\n\nکیا آپ ابھی یہ آزمانا چاہیں گے؟",
      "شکریہ کہ آپ نے مجھ سے یہ بات شیئر کی۔ 💙\n\nاللہ تعالیٰ فرماتے ہیں: 'بے شک اللہ کی یاد ہی دلوں کو سکون ملتا ہے۔' (الرعد: 28)\n\nکبھی کبھی گہری سانس اور استغفار پڑھنا بہت مدد کرتا ہے۔ آپ ابھی کیسا محسوس کر رہے ہیں؟",
      "آپ نے بہت صحیح کیا کہ مدد مانگی۔ یہ طاقت کی نشانی ہے، کمزوری کی نہیں۔ 🌟\n\nمجھے بتائیں — یہ تناؤ کب سے ہے؟ کیا کوئی خاص وجہ ہے جو آپ کو پریشان کر رہی ہے؟",
    ],
    en: [
      "Hello! I'm RelaxMind. Coming here took courage — I'm proud of you. 💚\n\nHow are you feeling today? Remember, you're not alone in what you're experiencing.",
      "I hear you, and your feelings are completely valid. 🌿\n\nWould you like to try a quick breathing exercise? The 4-7-8 technique works beautifully:\n• Inhale for 4 seconds\n• Hold for 7 seconds\n• Exhale slowly for 8 seconds\n\nShall we try it together?",
      "Thank you for trusting me with this. 💙\n\nAs the Quran reminds us: 'Verily, in the remembrance of Allah do hearts find rest.' (13:28)\n\nSometimes a few deep breaths and dhikr can bring immediate calm. How are you feeling right now?",
    ],
  };

  const langResponses = responses[language] || responses["ur"];
  const randomIndex = Math.floor(Math.random() * langResponses.length);
  return langResponses[randomIndex];
}
