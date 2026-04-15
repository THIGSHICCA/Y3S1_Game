import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({
      score: session.score,
      lives: session.lives,
      progress: session.progress,
    });
  } catch (error) {
    console.error("Session Retrieval Error:", error);
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const { score, lives, progress } = await request.json();

    if (typeof score === "number") session.score = score;
    if (typeof lives === "number") session.lives = lives;
    if (typeof progress === "string") session.progress = progress;

    await session.save();

    return NextResponse.json({
      success: true,
      data: {
        score: session.score,
        lives: session.lives,
        progress: session.progress,
      },
    });
  } catch (error) {
    console.error("Session Update Error:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ success: true, message: "Session cleared" });
  } catch (error) {
    console.error("Session Reset Error:", error);
    return NextResponse.json({ error: "Failed to reset session" }, { status: 500 });
  }
}
