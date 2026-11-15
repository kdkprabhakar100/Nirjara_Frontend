
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import {
  HelmetProvider,
  type HelmetServerState,
} from "react-helmet-async";

import App from "./App";
import type { AppInitialData } from "./App";

import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";

/* ============================================================
   TYPES
============================================================ */

export type SSRRenderResult = {
  html: string;
  head: string;
};

/* ============================================================
   SERVER-SIDE RENDERING

   Called by server.mjs for each incoming page request.

   url:
     The requested route, such as /services or /blog.

   initialData:
     Data fetched by the server for that route.
============================================================ */

export function render(
  url: string,
  initialData: AppInitialData = {}
): SSRRenderResult {
  /* ==========================================================
     HELMET CONTEXT

     Creates an isolated SEO context for each request.
  ========================================================== */

  const helmetContext: {
    helmet?: HelmetServerState | null;
  } = {};

  /* ==========================================================
     RENDER REACT TO HTML

     StaticRouter is used on the server.

     BrowserRouter remains in entry-client.tsx.
  ========================================================== */

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
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
      </StaticRouter>
    </HelmetProvider>
  );

  /* ==========================================================
     EXTRACT SEO METADATA

     SEO components generate tags through Helmet.

     This includes:
       - Page title
       - Meta description
       - Canonical URL
       - Open Graph tags
       - Other Helmet-generated metadata
  ========================================================== */

  const helmet = helmetContext.helmet;

  const head = [
    helmet?.title?.toString(),
    helmet?.base?.toString(),
    helmet?.meta?.toString(),
    helmet?.link?.toString(),
    helmet?.style?.toString(),
    helmet?.script?.toString(),
    helmet?.noscript?.toString(),
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" && value.length > 0
    )
    .join("\n");

  /* ==========================================================
     RETURN TO SSR SERVER

     server.mjs inserts:
       html -> #root
       head -> <head>

     It also serializes initialData into
     window.__NIRJARA_DATA__.
  ========================================================== */

  return {
    html,
    head,
  };
}
