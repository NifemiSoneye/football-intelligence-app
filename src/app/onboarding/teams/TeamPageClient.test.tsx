import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import TeamPageClient from "./TeamPageClient";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("next-safe-action/hooks", () => ({
  useAction: jest.fn(),
}));
jest.mock("../../actions/preferences-actions", () => ({
  savePreferencesAction: jest.fn(),
}));

describe("TeamPageClientInner", () => {
  const mockPush = jest.fn();
  const mockExecute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: jest.fn(),
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("[2021,2014]"),
    });
    (useAction as jest.Mock).mockReturnValue({
      execute: mockExecute,
      isPending: false,
    });
  });

  it("executes server action after selecting team and clicking get started", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          teams: [
            {
              id: 1,
              name: "Arsenal",
              crest: "https://example.com/arsenal.png",
            },
          ],
        }),
    });
    const user = userEvent.setup();
    render(<TeamPageClient />);

    // Click the Arsenal card
    await user.click(await screen.findByText("Arsenal"));

    // Click Get Started
    await user.click(screen.getByText("Get Started"));

    // Check router.push was called with the right URL
    expect(mockExecute).toHaveBeenCalledWith({
      favoriteLeaguesIds: [2021, 2014],
      favoriteTeamsIds: [1],
    });
  });
});
