import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { moodCheckins } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, moodScore, moodLabel, notes, language = "ur" } = body;

    if (!sessionId || !moodScore) {
      return NextResponse.json(
        { error: "sessionId and moodScore required" },
        { status: 400 }
      );
    }

    const [checkin] = await db
      .insert(moodCheckins)
      .values({
        sessionId,
        moodScore,
        moodLabel,
        notes,
        language,
      })
      .returning();

    return NextResponse.json({ checkin });
  } catch (error) {
    console.error("Mood API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId required" },
        { status: 400 }
      );
    }

    const checkins = await db
      .select()
      .from(moodCheckins)
      .where(eq(moodCheckins.sessionId, sessionId))
      .orderBy(desc(moodCheckins.createdAt))
      .limit(30);

    return NextResponse.json({ checkins });
  } catch (error) {
    console.error("Mood GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
