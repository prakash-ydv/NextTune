import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RoomContextProvider } from "./context/RoomContext.jsx";
import { ToastContextProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <RoomContextProvider>
    <ToastContextProvider>
      <App />
    </ToastContextProvider>
  </RoomContextProvider>
);
