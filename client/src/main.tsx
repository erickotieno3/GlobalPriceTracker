import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Very basic test render to verify React is working
try {
  console.log("Attempting to render React application");
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    createRoot(rootElement).render(<App />);
    console.log("React render call completed");
  } else {
    console.error("Root element not found in the DOM");
  }
} catch (error) {
  console.error("Error rendering React application:", error);
  
  // Fallback rendering if React fails
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <h1>Tesco Price Comparison</h1>
        <p>There was an error rendering the application.</p>
        <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
}
