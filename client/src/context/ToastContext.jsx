import React, { Children, createContext } from "react";
import { Bounce, toast } from "react-toastify";
// 1. Create the context
const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  const toastCodeCopy = () =>
    toast("Room Code Copied to Clipboard", {
      theme: "dark",
      autoClose: 3000,
      
    });

  return (
    <ToastContext.Provider value={{ toastCodeCopy }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
