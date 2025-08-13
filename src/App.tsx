import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom";
import QuizPage from "./pages/QuizPage";
import QuizHomePage from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
import LeadboardPage from "./pages/LeadboardPage";
import { ThemeProvider } from "./components/ThemeProvider";

function Router() {
  const element = useRoutes([
    {
      element: <RootLayout />,
      path: "/",
      children: [
        { element: <QuizHomePage />, index: true },
        { path: "quiz", element: <QuizPage /> },
        { path: "leaderboard", element: <LeadboardPage /> },
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
