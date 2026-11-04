import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found in index.html");

createRoot(rootElement).render(
  <StrictMode>
    {/* Last line of defense: an error outside the page area (e.g. in the Header) */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
