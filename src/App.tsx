import { useRoutes } from "react-router-dom";
import { Helmet } from "react-helmet";
import RootLayout from "./layouts/RootLayout";
import QuizHomePage from "./pages/QuizHomePage";
import QuizPage from "./pages/QuizPage";
import LeaderBoardPage from "./pages/LeaderboardPage";
import { BrowserRouter } from "react-router-dom";
function AppRouter() {
  const element = useRoutes([
    {
      element: <RootLayout />,
      path: "/",
      children: [
        { element: <QuizHomePage />, index: true },
        { path: "quiz", element: <QuizPage /> },
        { path: "leaderboard", element: <LeaderBoardPage /> },
      ],
    },
  ]);

  return <div>{element}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Helmet>
        {/* Podstawowe meta */}
        <title>Quiz Wygral – Sprawdź swoją wiedzę!</title>
        <meta
          name="description"
          content="Rozwiąż quiz, zdobywaj punkty i rywalizuj na tablicy wyników. Różne kategorie i poziomy trudności!"
        />
        <meta
          name="keywords"
          content="quiz, gra, wiedza, punkty, ranking, edukacja"
        />
        <meta name="author" content="Quiz Wygral" />

        {/* Kolor paska adresu / motyw przeglądarki */}
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1e293b"
          media="(prefers-color-scheme: dark)"
        />
      </Helmet>
      <AppRouter />
    </BrowserRouter>
  );
}
