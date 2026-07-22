import { savePreferencesAction } from "./preferences-actions";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

jest.mock("@/db", () => ({
  db: {
    query: {
      users: { findFirst: jest.fn() },
      userPreferences: { findFirst: jest.fn() },
    },
    update: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: jest.fn(),
}));
