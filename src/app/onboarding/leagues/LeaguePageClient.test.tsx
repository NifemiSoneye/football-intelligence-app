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
});
