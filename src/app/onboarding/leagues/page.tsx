import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import LeaguePageClient from "./LeaguePageClient";

export default async function LeaguesPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) redirect("/");

  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.kindeId, kindeUser.id))
    .limit(1);

  if (existingUser.length === 0) {
    // Insert new user
    const newUser = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        kindeId: kindeUser.id,
        email: kindeUser.email!,
        name: `${kindeUser.given_name} ${kindeUser.family_name}`.trim(),
        avatarUrl: kindeUser.picture,
      })
      .returning();

    // Create default preferences
    await db.insert(userPreferences).values({
      id: crypto.randomUUID(),
      userId: newUser[0].id,
    });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
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
