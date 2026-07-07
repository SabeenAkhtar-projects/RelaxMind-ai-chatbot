import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatSessionId = searchParams.get("chatSessionId");

    if (!chatSessionId) {
      return NextResponse.json(
        { error: "chatSessionId required" },
        { status: 400 }
      );
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.chatSessionId, parseInt(chatSessionId)))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({ messages: msgs });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
