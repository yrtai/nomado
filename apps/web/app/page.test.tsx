import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the project name and a GitHub link", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Nomado" })
    ).toBeDefined();
    expect(screen.getByRole("link", { name: "GitHub" })).toBeDefined();
  });
});
