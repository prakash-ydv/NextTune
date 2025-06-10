import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RoomContextProvider } from "./context/RoomContext.jsx";

createRoot(document.getElementById("root")).render(
  <RoomContextProvider>
    <App />
  </RoomContextProvider>
);
