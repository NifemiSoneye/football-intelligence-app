import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import TeamPageClient from "./TeamPageClient";

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ leagues?: string }>;
}) {
  const { leagues } = await searchParams;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) redirect("/");

  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.kindeId, user.id))
    .limit(1);

  if (existingUser.length === 0) {
    // Insert new user
    const newUser = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        kindeId: user.id,
        email: user.email!,
        name: `${user.given_name} ${user.family_name}`.trim(),
        avatarUrl: user.picture,
      })
      .returning();

    // Create default preferences
    await db.insert(userPreferences).values({
      id: crypto.randomUUID(),
      userId: newUser[0].id,
    });
  }

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
