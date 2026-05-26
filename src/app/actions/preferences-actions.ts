"user-server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
  insertUserPreferencesSchema,
  updateUserPreferencesSchema,
  type updateUserPreferencesType,
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
      parsedInput: userPreferences,
    }: {
      parsedInput: insertUserPreferencesType;
    }) => {
      const { getUser };
    },
  );
