import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) redirect("/");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!dbUser) redirect("/");

  const prefs = await db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, dbUser.id),
  });

  const initialLeagues = prefs?.favoriteLeaguesIds ?? [];
  const initialTeams = prefs?.favoriteTeamsIds ?? [];
  return (
    <SettingsClient
      initialLeagues={initialLeagues}
      initialTeams={initialTeams}
      KindeUser={user}
    />
  );
}
