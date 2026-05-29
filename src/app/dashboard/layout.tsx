import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { users, userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/context/SidebarContext";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <>
      <SidebarProvider>
        <Header />
        <div className="flex min-h-screen bg-[#0a0a0a]">
          <SideBar />
          <main className="flex-1 ">{children}</main>
        </div>
      </SidebarProvider>
    </>
  );
}
