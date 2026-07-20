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

  // your test goes here
});
