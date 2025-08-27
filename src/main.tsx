import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import LoadingPage from "./pages/LoadingPage";
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense
      fallback={
        <div>
          <LoadingPage />
        </div>
      }
    >
      <App></App>
    </Suspense>
  </StrictMode>
);
