import { db } from "@/db";
import { matchChatSession, chatMessages, users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LEAGUES } from "@/lib/constants";

export default async function SavedAnalysesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });
  if (!dbUser) redirect("/");

  // fetch all saved sessions with their messages
  const sessions = await db.query.matchChatSession.findMany({
    where: and(
      eq(matchChatSession.userId, dbUser.id),
      eq(matchChatSession.saved, true),
    ),
    with: {
      messages: {
        orderBy: desc(chatMessages.createdAt),
        limit: 1,
      },
    },
    orderBy: desc(matchChatSession.updatedAt),
  });

  const stripMarkdown = (text: string) =>
    text
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white font-display tracking-wide">
          SAVED ANALYSES
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Your match conversations</p>
      </div>

      {/* Empty state */}
      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-100 text-center gap-4">
          <p className="text-zinc-400 text-sm">No saved analyses yet.</p>
          <p className="text-zinc-600 text-xs">
            Visit a finished match, start a conversation and save it.
          </p>
          <Link
            href="/dashboard"
            className="text-xs text-[#e8ff47] hover:underline mt-2"
          >
            Go to Dashboard →
          </Link>
        </div>
      )}

      {/* Grid */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => {
            const snapshot = session.matchSnapshot as any;
            const lastMessage = session.messages?.[0];
            const leagueId = snapshot?.match?.leagueId;
            const matchId = session.matchId;

            // find league for message count display
            const totalMessages = session.messages?.length ?? 0;

            return (
              <Link
                key={session.id}
                href={`/dashboard/league/${leagueId}/matches/${matchId}?tab=ai`}
                className="block"
              >
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 hover:border-[#e8ff47] transition-colors h-full flex flex-col gap-4">
                  {/* Top section */}
                  <div>
                    {/* Competition + matchday */}
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
                      {snapshot?.match?.competition}
                      {snapshot?.match?.matchday
                        ? ` · Matchday ${snapshot.match.matchday}`
                        : ""}
                    </p>

                    {/* Teams + Score */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg font-bold font-display text-white truncate">
                        {snapshot?.match?.homeTeam}
                      </span>
                      <span className="text-2xl font-bold font-display text-[#e8ff47] shrink-0">
                        {snapshot?.match?.score?.home} -{" "}
                        {snapshot?.match?.score?.away}
                      </span>
                      <span className="text-lg font-bold font-display text-white truncate text-right">
                        {snapshot?.match?.awayTeam}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {new Date(snapshot?.match?.date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800" />

                  {/* Bottom section */}
                  <div className="flex flex-col gap-2 flex-1">
                    {lastMessage && (
                      <p className="text-xs text-zinc-300 line-clamp-2 font-body">
                        {stripMarkdown(lastMessage.content)}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
                        {totalMessages}/10 messages
                      </span>
                      <span className="text-xs text-[#e8ff47] font-bold">
                        Continue Analysis →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
