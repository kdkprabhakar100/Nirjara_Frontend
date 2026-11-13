
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";

import type { ServicesInitialData } from "./pages/public/Services";

type InitialData = {
  services?: ServicesInitialData;
};

declare global {
  interface Window {
    __NIRJARA_DATA__?: InitialData;
  }
}

const initialData = window.__NIRJARA_DATA__;

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <App initialData={initialData} />

          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
          />
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
