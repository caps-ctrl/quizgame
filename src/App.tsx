import { useRoutes, BrowserRouter } from "react-router-dom";
import React from "react";

import { ThemeProvider } from "./components/ThemeProvider";
const QuizHomePage = React.lazy(() => import("./pages/QuizHomePage"));
const RootLayout = React.lazy(() => import("./layouts/RootLayout"));
const LeaderBoardPage = React.lazy(() => import("./pages/LeaderboardPage"));
const QuizPage = React.lazy(() => import("./pages/QuizPage"));

function Router() {
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
    <ThemeProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}
