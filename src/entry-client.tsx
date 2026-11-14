
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import type { AppInitialData } from "./App";

import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";

/* ============================================================
   SSR INITIAL DATA

   Uses the same data interface as App.tsx so that
   every server-rendered page can receive its data.
============================================================ */

declare global {
  interface Window {
    __NIRJARA_DATA__?: AppInitialData;
  }
}

/* ============================================================
   READ DATA INJECTED BY THE SSR SERVER
============================================================ */

const initialData: AppInitialData =
  window.__NIRJARA_DATA__ ?? {};

/* ============================================================
   GET ROOT ELEMENT
============================================================ */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Nirjara hydration failed: #root element was not found.'
  );
}

/* ============================================================
   HYDRATE SERVER-RENDERED HTML

   hydrateRoot attaches React's event handlers to the
   existing server-rendered markup.

   Do not replace hydrateRoot with createRoot here.
============================================================ */

hydrateRoot(
  rootElement,
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
