import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  score: number;
  lives: number;
  progress: string;
}

export const defaultSession: SessionData = {
  score: 0,
  lives: 3,
  progress: "Level 1",
};

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "banana_game_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.score) {
    session.score = defaultSession.score;
    session.lives = defaultSession.lives;
    session.progress = defaultSession.progress;
  }

  return session;
}
