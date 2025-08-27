import { useRoutes } from "react-router-dom";

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
      <AppRouter />
    </BrowserRouter>
  );
}
