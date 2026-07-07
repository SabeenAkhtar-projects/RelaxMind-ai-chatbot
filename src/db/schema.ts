import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
  language: varchar("language", { length: 10 }).notNull().default("ur"),
  moodScore: integer("mood_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }),
  language: varchar("language", { length: 10 }).notNull().default("ur"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatSessionId: integer("chat_session_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moodCheckins = pgTable("mood_checkins", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  moodScore: integer("mood_score").notNull(), // 1-10
  moodLabel: varchar("mood_label", { length: 100 }),
  notes: text("notes"),
  language: varchar("language", { length: 10 }).notNull().default("ur"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'breathing' | 'cbt' | 'grounding' | 'dua'
  titleUrdu: text("title_urdu").notNull(),
  titleEnglish: text("title_english").notNull(),
  descriptionUrdu: text("description_urdu").notNull(),
  descriptionEnglish: text("description_english").notNull(),
  durationSeconds: integer("duration_seconds"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exerciseLogs = pgTable("exercise_logs", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  feedbackScore: integer("feedback_score"), // 1-5
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type MoodCheckin = typeof moodCheckins.$inferSelect;
export type NewMoodCheckin = typeof moodCheckins.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type ExerciseLog = typeof exerciseLogs.$inferSelect;
export type NewExerciseLog = typeof exerciseLogs.$inferInsert;
