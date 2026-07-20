import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import LeaguePageClient from "./LeaguePageClient";

// Mock next/navigation's useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LeaguePageClient", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the step heading", () => {
    render(<LeaguePageClient />);
    expect(screen.getByText(/Choose your/i)).toBeInTheDocument();
  });

  it("navigates to teams page with selected league when Next is clicked", async () => {
    const user = userEvent.setup();
    render(<LeaguePageClient />);

    // Click the Premier League card
    await user.click(screen.getByText("Premier League"));

    // Click Next
    await user.click(screen.getByText("Next"));

    // Check router.push was called with the right URL
    expect(mockPush).toHaveBeenCalledWith(
      "/onboarding/teams?leagues=%5B2021%5D",
    );
  });
  it("deselects a league when toggled", async () => {
    const user = userEvent.setup();
    render(<LeaguePageClient />);

    await user.click(screen.getByText("Premier League"));
    await user.click(screen.getByText("Premier League"));

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();

    await user.click(nextButton);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
