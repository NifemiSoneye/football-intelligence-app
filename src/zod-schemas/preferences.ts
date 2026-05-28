import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userPreferences } from "@/db/schema";
import z from "zod";

export const insertUserPreferencesSchema = createInsertSchema(userPreferences, {
  favoriteLeaguesIds: z.array(z.number()).min(1, "Select at least one league"),
  favoriteTeamsIds: z.array(z.number()),
});

export const userPreferencesInputSchema = insertUserPreferencesSchema.pick({
  favoriteLeaguesIds: true,
  favoriteTeamsIds: true,
});

export type insertUserPreferencesType = z.infer<
  typeof insertUserPreferencesSchema
>;
export type userPreferencesInputType = z.infer<
  typeof userPreferencesInputSchema
>;
