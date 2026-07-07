import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { exercises, exerciseLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allExercises = await db
      .select()
      .from(exercises)
      .where(eq(exercises.isActive, true));

    return NextResponse.json({ exercises: allExercises });
  } catch (error) {
    console.error("Exercises GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, exerciseId, feedbackScore } = body;

    if (!sessionId || !exerciseId) {
      return NextResponse.json(
        { error: "sessionId and exerciseId required" },
        { status: 400 }
      );
    }

    const [log] = await db
      .insert(exerciseLogs)
      .values({
        sessionId,
        exerciseId,
        feedbackScore,
      })
      .returning();

    return NextResponse.json({ log });
  } catch (error) {
    console.error("Exercise log error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
