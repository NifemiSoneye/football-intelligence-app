"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
  insertUserPreferencesSchema,
  type insertUserPreferencesType,
} from "@/zod-schemas/preferences";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const savePreferencesAction = actionClient
  .metadata({ actionName: "savePreferencesAction" })
  .schema(insertUserPreferencesSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: userPreference,
    }: {
      parsedInput: insertUserPreferencesType;
    }) => {
      const { getUser } = getKindeServerSession();
      const kindeUser = await getUser();
      if (!kindeUser?.id) redirect("/login");

      const dbUser = await db.query.users.findFirst({
        where: eq(users.kindeId, kindeUser.id),
      });

      if (!dbUser) throw new Error("User not found");

      const existing = await db.query.userPreferences.findFirst({
        where: eq(userPreferences.userId, dbUser.id),
      });

      if (existing) {
        await db
          .update(userPreferences)
          .set({
            favoriteLeaguesIds: userPreference.favoriteLeaguesIds,
            favoriteTeamsIds: userPreference.favoriteTeamsIds,
            updatedAt: new Date(),
          })
          .where(eq(userPreferences.id, existing.id));
        return {
          message: "User Preferences updated successfully",
        };
      }
      await db.insert(userPreferences).values({
        id: crypto.randomUUID(),
        userId: dbUser.id,
        favoriteLeaguesIds: userPreference.favoriteLeaguesIds,
        favoriteTeamsIds: userPreference.favoriteTeamsIds,
      });
      return {
        message: "User Preferences created successfully",
      };
    },
  );
