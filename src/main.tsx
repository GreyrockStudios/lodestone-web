import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, HashRouter } from "react-router-dom"
import App from "./App"
import { PrefsProvider } from "./hooks/usePrefs"
import { AuthProvider } from "./hooks/useAuth"
import "./styles/globals.css"

// Tauri 2 injects __TAURI_INTERNALS__ before page scripts run.
// Check both for compatibility with Tauri 1 and 2.
const isTauri = typeof window !== "undefined" && (!!(window as any).__TAURI__ || !!(window as any).__TAURI_INTERNALS__)
if (isTauri) {
  document.documentElement.classList.add("is-tauri")
}

// Tauri uses custom protocol — BrowserRouter doesn't work.
// Use HashRouter in Tauri, BrowserRouter on the web.
const Router = isTauri ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <PrefsProvider>
        <App />
      </PrefsProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
