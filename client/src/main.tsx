import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { I18nextProvider } from "react-i18next";
import i18n from "./lib/i18n";

// Render immediately since i18n is already initialized
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </QueryClientProvider>
);
