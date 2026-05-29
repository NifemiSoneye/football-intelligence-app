import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import TeamPageClient from "./TeamPageClient";
import { users } from "@/db/schema";

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ leagues?: string }>;
}) {
  const { leagues } = await searchParams;
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

  if (!leagues) redirect("/onboarding/leagues");
  if (prefs?.favoriteTeamsIds?.length) {
    redirect("/dashboard");
  }

  return <TeamPageClient />;
}
