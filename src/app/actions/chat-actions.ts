"use server";

import { db } from "@/db";
import { chatMessages, matchChatSession } from "@/db/schema";
import { sendChatMessage, MAX_MESSAGES_PER_SESSION } from "@/lib/claude";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { users } from "@/db/schema";
import { MatchSnapshot } from "@/lib/claude";

export async function sendMessage(matchId: number, userMessage: string) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser?.id) redirect("/login");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });
  if (!dbUser) throw new Error("User not found");

  const existingSession = await db.query.matchChatSession.findFirst({
    where: and(
      eq(matchChatSession.userId, dbUser.id),
      eq(matchChatSession.matchId, matchId),
    ),
  });

  if (!existingSession) throw new Error("Session not found");

  const messages = await db.query.chatMessages.findMany({
    where: eq(chatMessages.sessionId, existingSession.id),
    orderBy: asc(chatMessages.createdAt),
  });
  if (messages.length >= MAX_MESSAGES_PER_SESSION)
    throw new Error("Message limit Reached");

  const formattedMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const response = await sendChatMessage(
    existingSession.matchSnapshot as MatchSnapshot,
    formattedMessages,
    userMessage,
  );
  await db.insert(chatMessages).values({
    id: crypto.randomUUID(),
    sessionId: existingSession.id,
    role: "user",
    content: userMessage,
  });

  await db.insert(chatMessages).values({
    id: crypto.randomUUID(),
    sessionId: existingSession.id,
    role: "assistant",
    content: response,
  });
  return response;
}
