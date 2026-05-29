import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import LeaguePageClient from "./LeaguePageClient";
import { users } from "@/db/schema";

export default async function LeaguesPage() {
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
  if (prefs?.favoriteLeaguesIds?.length) {
    redirect("/dashboard");
  }

  return <LeaguePageClient />;
}
