import React from "react";
import ReactDOM from "react-dom/client";
import { MilkdownProvider } from "@milkdown/react";
import App from "./App";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MilkdownProvider>
      <App />
    </MilkdownProvider>
  </React.StrictMode>,
);
