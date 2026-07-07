export type Language = "ur" | "en" | "pa" | "sd";

export interface ChatMessage {
  id?: number;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date | string;
}

export interface ChatSessionData {
  id: number;
  sessionId: string;
  title: string | null;
  language: string;
  createdAt: Date | string;
}

export interface MoodCheckinData {
  id: number;
  sessionId: string;
  moodScore: number;
  moodLabel: string | null;
  notes: string | null;
  createdAt: Date | string;
}

export interface ExerciseData {
  id: number;
  type: string;
  titleUrdu: string;
  titleEnglish: string;
  descriptionUrdu: string;
  descriptionEnglish: string;
  durationSeconds: number | null;
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  ur: "اردو",
  en: "English",
  pa: "پنجابی",
  sd: "سنڌي",
};

export const MOOD_LABELS: Record<Language, Record<number, string>> = {
  ur: {
    1: "بہت برا",
    2: "برا",
    3: "ٹھیک نہیں",
    4: "کچھ بہتر",
    5: "درمیانہ",
    6: "ٹھیک",
    7: "اچھا",
    8: "بہت اچھا",
    9: "خوش",
    10: "بہترین",
  },
  en: {
    1: "Very Bad",
    2: "Bad",
    3: "Not Good",
    4: "Slightly Better",
    5: "Neutral",
    6: "Okay",
    7: "Good",
    8: "Very Good",
    9: "Happy",
    10: "Excellent",
  },
  pa: {
    1: "بہت ماڑا",
    2: "ماڑا",
    3: "ٹھیک نہیں",
    4: "کجھ بہتر",
    5: "درمیانہ",
    6: "ٹھیک",
    7: "چنگا",
    8: "بہت چنگا",
    9: "خوش",
    10: "بہترین",
  },
  sd: {
    1: "تمام خراب",
    2: "خراب",
    3: "ٺيڪ نه",
    4: "ٿورو بهتر",
    5: "وچ",
    6: "ٺيڪ",
    7: "سٺو",
    8: "تمام سٺو",
    9: "خوش",
    10: "بهترين",
  },
};

export const UI_TEXT: Record<Language, Record<string, string>> = {
  ur: {
    appName: "RelaxMind",
    tagline: "آپ کا ذہنی صحت کا ساتھی",
    heroTitle: "آپ اکیلے نہیں ہیں",
    heroSubtitle: "پاکستان کا پہلا اردو AI ذہنی صحت کا ساتھی — ثقافتی، اسلامی، اور ہمدرد",
    startChat: "بات شروع کریں",
    exercises: "مشقیں",
    moodTracker: "موڈ ٹریکر",
    history: "تاریخ",
    settings: "ترتیبات",
    typeMessage: "یہاں لکھیں...",
    send: "بھیجیں",
    newChat: "نئی بات",
    moodQuestion: "آج آپ کیسا محسوس کر رہے ہیں؟",
    saveMood: "محفوظ کریں",
    crisisHelp: "بحران؟ ابھی مدد لیں",
    crisisLine: "0317-4288665",
    disclaimer: "یہ تھراپی کا متبادل نہیں۔ ہنگامی صورت میں فوری مدد لیں۔",
    breathingExercise: "سانس کی مشق",
    groundingExercise: "زمینی مشق",
    cbtExercise: "خیالات کو چیلنج",
    duaExercise: "ذکر و دعا",
    start: "شروع کریں",
    close: "بند کریں",
    done: "مکمل",
    howAreYou: "السلام علیکم! آج آپ کیسا محسوس کر رہے ہیں؟",
    selectLanguage: "زبان منتخب کریں",
    minutes: "منٹ",
    seconds: "سیکنڈ",
  },
  en: {
    appName: "RelaxMind",
    tagline: "Your Mental Wellness Companion",
    heroTitle: "You Are Not Alone",
    heroSubtitle: "Pakistan's first AI mental health first-aid companion — culturally safe, Islamically grounded, compassionate",
    startChat: "Start a Conversation",
    exercises: "Exercises",
    moodTracker: "Mood Tracker",
    history: "History",
    settings: "Settings",
    typeMessage: "Type your message...",
    send: "Send",
    newChat: "New Chat",
    moodQuestion: "How are you feeling today?",
    saveMood: "Save",
    crisisHelp: "In Crisis? Get Help Now",
    crisisLine: "0317-4288665",
    disclaimer: "Not a therapy replacement. Seek immediate help in emergencies.",
    breathingExercise: "Breathing Exercise",
    groundingExercise: "Grounding Exercise",
    cbtExercise: "Challenge Thoughts",
    duaExercise: "Dhikr & Dua",
    start: "Start",
    close: "Close",
    done: "Done",
    howAreYou: "Assalamualaikum! How are you feeling today?",
    selectLanguage: "Select Language",
    minutes: "min",
    seconds: "sec",
  },
  pa: {
    appName: "RelaxMind",
    tagline: "تُہاڈا ذہنی صحت دا ساتھی",
    heroTitle: "تُسی اکیلے نہیں ہو",
    heroSubtitle: "پاکستان دا پہلا AI ذہنی صحت دا ساتھی",
    startChat: "گل شروع کرو",
    exercises: "مشقاں",
    moodTracker: "موڈ ٹریکر",
    history: "تاریخ",
    settings: "ترتیباں",
    typeMessage: "ایتھے لکھو...",
    send: "بھیجو",
    newChat: "نئی گل",
    moodQuestion: "اج تُسی کیویں محسوس کر رہے ہو؟",
    saveMood: "محفوظ کرو",
    crisisHelp: "بحران؟ ہن مدد لؤ",
    crisisLine: "0317-4288665",
    disclaimer: "ایہہ تھراپی نہیں۔ ہنگامی حالت وچ فوری مدد لؤ۔",
    breathingExercise: "سانس دی مشق",
    groundingExercise: "زمینی مشق",
    cbtExercise: "خیالاں نوں چیلنج",
    duaExercise: "ذکر تے دعا",
    start: "شروع کرو",
    close: "بند کرو",
    done: "مکمل",
    howAreYou: "السلام علیکم! اج تُسی کیویں ہو؟",
    selectLanguage: "زبان چُنو",
    minutes: "منٹ",
    seconds: "سیکنڈ",
  },
  sd: {
    appName: "RelaxMind",
    tagline: "توهان جو ذهني صحت جو ساٿي",
    heroTitle: "توهان اڪيلا ناهيو",
    heroSubtitle: "پاڪستان جو پهريون AI ذهني صحت جو ساٿي",
    startChat: "ڳالهه شروع ڪريو",
    exercises: "مشقون",
    moodTracker: "موڊ ٽريڪر",
    history: "تاريخ",
    settings: "ترتيبون",
    typeMessage: "هتي لکو...",
    send: "موڪليو",
    newChat: "نئين ڳالهه",
    moodQuestion: "اڄ توهان ڪيئن محسوس ڪري رهيا آهيو؟",
    saveMood: "محفوظ ڪريو",
    crisisHelp: "بحران؟ هاڻي مدد وٺو",
    crisisLine: "0317-4288665",
    disclaimer: "هي علاج نه آهي. فوري مدد وٺو.",
    breathingExercise: "سانهن جي مشق",
    groundingExercise: "زميني مشق",
    cbtExercise: "خيالن کي چيلينج",
    duaExercise: "ذڪر ۽ دعا",
    start: "شروع ڪريو",
    close: "بند ڪريو",
    done: "مڪمل",
    howAreYou: "السلام عليڪم! اڄ توهان ڪيئن آهيو؟",
    selectLanguage: "ٻولي چونڊيو",
    minutes: "منٽ",
    seconds: "سيڪنڊ",
  },
};
