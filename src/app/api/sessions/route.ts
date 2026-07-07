import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chatSessions, messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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

    const sessions = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId))
      .orderBy(desc(chatSessions.createdAt))
      .limit(20);

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Sessions GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatSessionId = searchParams.get("chatSessionId");

    if (!chatSessionId) {
      return NextResponse.json(
        { error: "chatSessionId required" },
        { status: 400 }
      );
    }

    await db
      .delete(chatSessions)
      .where(eq(chatSessions.id, parseInt(chatSessionId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sessions DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
