import { renderWithRouter } from "./test-utils";
import QuizHomePage from "../pages/QuizHomePage";
import "@testing-library/jest-dom";

import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");

  return {
    ...actual,
    motion: {
      div: (prop: any) => <div {...prop} />,
      aside: (prop: any) => <aside {...prop} />,
      article: (prop: any) => <article {...prop} />,
    },
  };
});

describe("HomePage ", () => {
  it("should display navBar and correct links ", () => {
    const screen = renderWithRouter(<QuizHomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /quiz wygral/i })
    ).toBeInTheDocument();

    const startButtons = screen.getAllByRole("link", { name: /start/i });

    expect(startButtons).toHaveLength(2);
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /leaderboard/i })
    ).toBeInTheDocument();
  });

  it("should save player name to localStorage", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    const screen = renderWithRouter(<QuizHomePage />);

    const input = screen.getByPlaceholderText("Twoje imię");

    await userEvent.clear(input);
    await userEvent.type(input, "Marcel");

    const startButton = screen.getByRole("button", { name: "Start" });
    await userEvent.click(startButton);

    expect(setItemSpy).toBeCalledWith("quiz-player-name", "Marcel");
  });

  it("should download from localStorage Scores", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "getItem");
    renderWithRouter(<QuizHomePage />);
    expect(setItemSpy).toHaveBeenCalledWith("quiz-scores");
  });

  it("should render correct scores", () => {
    const scores = [
      {
        name: "Marcel",
        score: 12,
        date: new Date("2025-08-02"),
      },
    ];

    localStorage.setItem("quiz-scores", JSON.stringify(scores));
    const screen = renderWithRouter(<QuizHomePage />);

    expect(screen.getByText("Marcel")).toBeInTheDocument();
    expect(screen.getByText("12 pkt")).toBeInTheDocument();
    expect(screen.getByText("2.08.2025, 02:00:00")).toBeInTheDocument();
  });

  it("should ", () => {});
});
