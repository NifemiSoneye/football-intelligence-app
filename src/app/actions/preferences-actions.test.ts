import { savePreferencesAction } from "./preferences-actions";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

jest.mock("../../db/index.ts", () => ({
  db: {
    query: {
      users: { findFirst: jest.fn() },
      userPreferences: { findFirst: jest.fn() },
    },
    update: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("../../lib/safe-action", () => ({
  actionClient: {
    metadata: () => ({
      schema: () => ({
        action: (handler: any) => handler,
      }),
    }),
  },
}));
jest.mock("next-safe-action", () => ({
  flattenValidationErrors: jest.fn(),
}));

jest.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: jest.fn(),
}));

describe("savePreferencesAction", () => {
  const mockUpdateWhere = jest.fn().mockResolvedValue(undefined);
  const mockUpdateSet = jest.fn().mockReturnValue({ where: mockUpdateWhere });
  const mockInsertValues = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    (getKindeServerSession as jest.Mock).mockReturnValue({
      getUser: jest.fn().mockResolvedValue({ id: "kinde-123" }),
    });
    (db.update as jest.Mock).mockReturnValue({ set: mockUpdateSet });
    (db.insert as jest.Mock).mockReturnValue({ values: mockInsertValues });
  });

  it("updates preferences when they already exist", async () => {
    const mockDbUser = { id: "user-1", kindeId: "kinde-123" };
    const mockExistingPrefs = { id: "pref-1", userId: "user-1" };

    (db.query.users.findFirst as jest.Mock).mockResolvedValue(mockDbUser);
    (db.query.userPreferences.findFirst as jest.Mock).mockResolvedValue(
      mockExistingPrefs,
    );

    await (savePreferencesAction as any)({
      parsedInput: {
        favoriteLeaguesIds: [2021],
        favoriteTeamsIds: [1],
      },
    });

    expect(mockUpdateSet).toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });
  it("creates preferences when they dont exist", async () => {
    const mockDbUser = { id: "user-1", kindeId: "kinde-123" };

    (db.query.users.findFirst as jest.Mock).mockResolvedValue(mockDbUser);
    (db.query.userPreferences.findFirst as jest.Mock).mockResolvedValue(null);

    await (savePreferencesAction as any)({
      parsedInput: {
        favoriteLeaguesIds: [2021],
        favoriteTeamsIds: [1],
      },
    });

    expect(mockInsertValues).toHaveBeenCalled();
    expect(db.update).not.toHaveBeenCalled();
  });
});
