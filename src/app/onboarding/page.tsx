import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { users, userPreferences } from "@/db/schema";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id) redirect("/login");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });

  if (!dbUser) redirect("/login");

  const existing = await db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, dbUser.id),
  });

  if (
    existing &&
    existing.favoriteLeaguesIds &&
    existing.favoriteLeaguesIds.length > 0
  ) {
    redirect("/dashboard");
  }

  return <OnboardingForm />;
}
