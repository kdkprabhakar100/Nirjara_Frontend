
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { loadEnv } from "vite";

/* ============================================================
   CONFIGURATION
============================================================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";
const mode = isProduction ? "production" : "development";

const env = loadEnv(mode, __dirname, "");

const START_PORT = Number(
  process.env.PORT || env.PORT || 5173
);

const HOST =
  process.env.HOST || env.HOST || "localhost";

const MAX_PORT_ATTEMPTS = 50;

const API_URL = (
  process.env.API_URL ||
  process.env.VITE_API_URL ||
  env.API_URL ||
  env.VITE_API_URL ||
  "http://127.0.0.1:5000"
).replace(/\/+$/, "");

/* ============================================================
   EXPRESS APPLICATION
============================================================ */

const app = express();

app.disable("x-powered-by");

/* ============================================================
   VITE DEVELOPMENT / PRODUCTION

   Development:
   Vite provides middleware and transforms TSX for SSR.

   Production:
   Serve the built client and import the server bundle.
============================================================ */

let vite;

if (!isProduction) {
  const { createServer } = await import("vite");

  vite = await createServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
} else {
  app.use(
    express.static(
      path.resolve(__dirname, "dist/client"),
      {
        index: false,
        maxAge: "1h",
      }
    )
  );
}

/* ============================================================
   ROUTE VALIDATION
============================================================ */

const privateRoutes = new Set([
  "/cart",
  "/checkout",
  "/order-success",
]);

const knownRoutes = new Set([
  "/",
  "/services",
  "/gallery",
  "/branches",
  "/academy",
  "/blog",
  "/contact",
  "/booking",
  "/products",
  "/cart",
  "/checkout",
  "/events",
  "/careers",
  "/about",
  "/privacy-policy",
  "/terms",
  "/order-success",
  "/social-media",
]);

function isKnownRoute(pathname) {
  return (
    knownRoutes.has(pathname) ||
    /^\/products\/[^/]+$/.test(pathname) ||
    /^\/blog\/[^/]+$/.test(pathname) ||
    /^\/events\/[^/]+$/.test(pathname)
  );
}

/* ============================================================
   API HELPERS
============================================================ */

function extractList(payload, key) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.[key])) {
    return payload[key];
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function extractObject(payload, key) {
  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return null;
  }

  if (payload._id) {
    return payload;
  }

  const nested = payload[key] ?? payload.data;

  return nested &&
    typeof nested === "object" &&
    !Array.isArray(nested)
    ? nested
    : null;
}

/* ============================================================
   FETCH BACKEND API DATA

   Each API request has a 10-second timeout.
============================================================ */

async function apiGet(endpoint) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!response.ok) {
    const error = new Error(
      `API ${endpoint} returned HTTP ${response.status}`
    );

    error.status = response.status;

    throw error;
  }

  return response.json();
}

/* ============================================================
   OPTIONAL CMS DATA LOADING

   A temporary backend failure should not automatically
   cause every public page to return HTTP 500.

   If SSR data is unavailable, omit its initial-data key.
   The React component can then fetch in the browser.
============================================================ */

async function tryLoad(label, loader) {
  try {
    return await loader();
  } catch (error) {
    console.error(
      `[Nirjara SSR] ${label}:`,
      error
    );

    return undefined;
  }
}

/* ============================================================
   PUBLISHED BLOGS

   This excludes records explicitly marked as drafts.
   The backend must still enforce public visibility.
============================================================ */

function publishedBlogs(payload) {
  return extractList(payload, "blogs").filter(
    (blog) =>
      blog &&
      blog.status !== "draft"
  );
}

/* ============================================================
   LOAD INITIAL DATA FOR EACH PUBLIC ROUTE

   The property names match AppInitialData in src/App.tsx.

   The returned objects are passed to the corresponding
   page components before renderToString runs.
============================================================ */

async function loadInitialData(pathname) {
  const initialData = {};

  /* ==========================================================
     HOME PAGE
  ========================================================== */

  if (pathname === "/") {
    const data = await tryLoad(
      "homepage",
      async () => {
        const [
          servicesPayload,
          branchesPayload,
          settingsPayload,
        ] = await Promise.all([
          apiGet("/api/services"),
          apiGet("/api/branches"),
          apiGet("/api/site-settings"),
        ]);

        const stats =
          settingsPayload?.homepageStats ?? {};

        return {
          services: extractList(
            servicesPayload,
            "services"
          ).slice(0, 6),

          branches: extractList(
            branchesPayload,
            "branches"
          ),

          homepageStats: {
            establishedYear: Number(
              stats.establishedYear ?? 2014
            ),

            happyClients: Number(
              stats.happyClients ?? 5000
            ),

            certifiedGraduates: Number(
              stats.certifiedGraduates ?? 200
            ),
          },
        };
      }
    );

    if (data) {
      initialData.home = data;
    }
  }

  /* ==========================================================
     SERVICES
  ========================================================== */

  if (pathname === "/services") {
    const data = await tryLoad(
      "services",
      async () => {
        const [
          servicesPayload,
          categoriesPayload,
        ] = await Promise.all([
          apiGet("/api/services"),
          apiGet("/api/service-categories"),
        ]);

        return {
          services: extractList(
            servicesPayload,
            "services"
          ),

          categories: extractList(
            categoriesPayload,
            "categories"
          ),
        };
      }
    );

    if (data) {
      initialData.services = data;
    }
  }

  /* ==========================================================
     BRANCHES
  ========================================================== */

  if (pathname === "/branches") {
    const data = await tryLoad(
      "branches",
      async () => ({
        branches: extractList(
          await apiGet("/api/branches"),
          "branches"
        ),
      })
    );

    if (data) {
      initialData.branches = data;
    }
  }

  /* ==========================================================
     ACADEMY
  ========================================================== */

  if (pathname === "/academy") {
    const data = await tryLoad(
      "academy",
      async () => ({
        courses: extractList(
          await apiGet("/api/courses"),
          "courses"
        ),
      })
    );

    if (data) {
      initialData.academy = data;
    }
  }

  /* ==========================================================
     BLOG LISTING
  ========================================================== */

  if (pathname === "/blog") {
    const data = await tryLoad(
      "blog",
      async () => ({
        blogs: publishedBlogs(
          await apiGet("/api/blogs")
        ),
      })
    );

    if (data) {
      initialData.blog = data;
    }
  }

  /* ==========================================================
     BLOG DETAILS

     URL example:
     /blog/hair-care-tips
  ========================================================== */

  if (pathname.startsWith("/blog/")) {
    const slug = decodeURIComponent(
      pathname.slice("/blog/".length)
    );

    const data = await tryLoad(
      "blog details",
      async () => {
        const [
          articleResult,
          recentResult,
        ] = await Promise.allSettled([
          apiGet(
            `/api/blogs/slug/${encodeURIComponent(slug)}`
          ),
          apiGet("/api/blogs"),
        ]);

        if (
          articleResult.status === "rejected" &&
          articleResult.reason?.status !== 404
        ) {
          throw articleResult.reason;
        }

        const article =
          articleResult.status === "fulfilled"
            ? extractObject(
                articleResult.value,
                "blog"
              )
            : null;

        const blog =
          article?.status === "draft"
            ? null
            : article;

        const recentPosts =
          recentResult.status === "fulfilled"
            ? publishedBlogs(recentResult.value)
            : [];

        return {
          slug,
          blog,
          recentPosts,
        };
      }
    );

    if (data) {
      initialData.blogDetails = data;

      if (!data.blog) {
        initialData.__notFound = true;
      }
    }
  }

  /* ==========================================================
     CONTACT
  ========================================================== */

  if (pathname === "/contact") {
    const data = await tryLoad(
      "contact",
      async () => {
        const [
          branchesPayload,
          settingsPayload,
        ] = await Promise.all([
          apiGet("/api/branches"),
          apiGet("/api/site-settings"),
        ]);

        return {
          branches: extractList(
            branchesPayload,
            "branches"
          ),

          settings: {
            phone:
              settingsPayload?.phone ?? "",

            email:
              settingsPayload?.email ?? "",
          },
        };
      }
    );

    if (data) {
      initialData.contact = data;
    }
  }

  /* ==========================================================
     BOOKING
  ========================================================== */

  if (pathname === "/booking") {
    const data = await tryLoad(
      "booking",
      async () => {
        const [
          servicesPayload,
          coursesPayload,
          branchesPayload,
        ] = await Promise.all([
          apiGet("/api/services"),
          apiGet("/api/courses"),
          apiGet("/api/branches"),
        ]);

        return {
          services: extractList(
            servicesPayload,
            "services"
          ),

          courses: extractList(
            coursesPayload,
            "courses"
          ),

          branches: extractList(
            branchesPayload,
            "branches"
          ),
        };
      }
    );

    if (data) {
      initialData.booking = data;
    }
  }

  /* ==========================================================
     EVENTS LISTING
  ========================================================== */

  if (pathname === "/events") {
    const data = await tryLoad(
      "events",
      async () => {
        const [
          eventsPayload,
          branchesPayload,
        ] = await Promise.all([
          apiGet("/api/events"),
          apiGet("/api/branches"),
        ]);

        return {
          events: extractList(
            eventsPayload,
            "events"
          ),

          branches: extractList(
            branchesPayload,
            "branches"
          ),
        };
      }
    );

    if (data) {
      initialData.events = data;
    }
  }

  /* ==========================================================
     EVENT DETAILS

     URL example:
     /events/671c123456789
  ========================================================== */

  if (pathname.startsWith("/events/")) {
    const id = decodeURIComponent(
      pathname.slice("/events/".length)
    );

    const data = await tryLoad(
      "event details",
      async () => {
        const [
          eventResult,
          eventsResult,
          branchesResult,
        ] = await Promise.allSettled([
          apiGet(
            `/api/events/${encodeURIComponent(id)}`
          ),
          apiGet("/api/events"),
          apiGet("/api/branches"),
        ]);

        if (
          eventResult.status === "rejected" &&
          eventResult.reason?.status !== 404
        ) {
          throw eventResult.reason;
        }

        const event =
          eventResult.status === "fulfilled"
            ? extractObject(
                eventResult.value,
                "event"
              )
            : null;

        const allEvents =
          eventsResult.status === "fulfilled"
            ? extractList(
                eventsResult.value,
                "events"
              )
            : [];

        const branches =
          branchesResult.status === "fulfilled"
            ? extractList(
                branchesResult.value,
                "branches"
              )
            : [];

        return {
          event,
          relatedEvents: allEvents
            .filter(
              (item) =>
                item._id !== id
            )
            .slice(0, 3),

          branches,
        };
      }
    );

    if (data) {
      initialData.eventDetails = data;

      if (!data.event) {
        initialData.__notFound = true;
      }
    }
  }

  /* ==========================================================
     CAREERS
  ========================================================== */

  if (pathname === "/careers") {
    const data = await tryLoad(
      "careers",
      async () => ({
        careers: extractList(
          await apiGet("/api/careers"),
          "careers"
        ),
      })
    );

    if (data) {
      initialData.careers = data;
    }
  }

  /* ==========================================================
     ABOUT
  ========================================================== */

  if (pathname === "/about") {
    const data = await tryLoad(
      "about",
      async () => ({
        teamMembers: extractList(
          await apiGet("/api/teams/public"),
          "teamMembers"
        ),
      })
    );

    if (data) {
      initialData.about = data;
    }
  }

  /* ==========================================================
     OTHER PAGES

     Gallery, products, product details, legal pages,
     and social media have not yet been adapted to
     accept route-specific SSR data.
  ========================================================== */

  return initialData;
}

/* ============================================================
   SAFELY SERIALIZE HYDRATION DATA

   Prevent HTML/script injection when embedding JSON
   into an inline script.
============================================================ */

function serializeInitialData(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/* ============================================================
   SERVER-SIDE RENDERING HANDLER
============================================================ */

app.get(/.*/, async (req, res, next) => {
  try {
    const pathname =
      req.path.replace(/\/+$/, "") || "/";

    /* ========================================================
       VALIDATE ROUTE
    ======================================================== */

    if (!isKnownRoute(pathname)) {
      return res
        .status(404)
        .type("html")
        .send(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>404 | Nirjara Beauty</title>
              <meta name="robots" content="noindex" />
            </head>

            <body>
              <h1>404 - Page Not Found</h1>
            </body>
          </html>
        `);
    }

    const url = req.originalUrl;

    let template;
    let render;

    /* ========================================================
       DEVELOPMENT SSR
    ======================================================== */

    if (!isProduction) {
      template = await fs.readFile(
        path.resolve(
          __dirname,
          "index.html"
        ),
        "utf-8"
      );

      template = await vite.transformIndexHtml(
        url,
        template
      );

      const ssrModule =
        await vite.ssrLoadModule(
          "/src/entry-server.tsx"
        );

      render = ssrModule.render;
    } else {
      /* ======================================================
         PRODUCTION SSR
      ====================================================== */

      template = await fs.readFile(
        path.resolve(
          __dirname,
          "dist/client/index.html"
        ),
        "utf-8"
      );

      const ssrModule = await import(
        "./dist/server/entry-server.js"
      );

      render = ssrModule.render;
    }

    /* ========================================================
       FETCH PAGE DATA
    ======================================================== */

    const initialData =
      await loadInitialData(pathname);

    const notFound =
      initialData.__notFound === true;

    delete initialData.__notFound;

    /* ========================================================
       RENDER REACT
    ======================================================== */

    const result = await render(
      url,
      initialData
    );

    /* ========================================================
       CHECK HTML TEMPLATE
    ======================================================== */

    if (
      !template.includes("<!--ssr-head-->") ||
      !template.includes("<!--ssr-outlet-->")
    ) {
      throw new Error(
        "SSR placeholders missing from index.html"
      );
    }

    /* ========================================================
       INJECT SSR DATA
    ======================================================== */

    const hydrationScript =
      `<script>window.__NIRJARA_DATA__ = ${
        serializeInitialData(initialData)
      };</script>`;

    /* ========================================================
       BUILD FINAL HTML
    ======================================================== */

    const html = template
      .replace(
        "<!--ssr-head-->",
        () => result.head || ""
      )
      .replace(
        "<!--ssr-outlet-->",
        () => result.html || ""
      )
      .replace(
        "</head>",
        () => `${hydrationScript}\n</head>`
      );

    /* ========================================================
       SEARCH ENGINE DIRECTIVES
    ======================================================== */

    if (
      privateRoutes.has(pathname) ||
      notFound
    ) {
      res.setHeader(
        "X-Robots-Tag",
        "noindex, follow"
      );
    }

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    return res
      .status(notFound ? 404 : 200)
      .type("html")
      .send(html);
  } catch (error) {
    if (vite) {
      vite.ssrFixStacktrace(error);
    }

    console.error(
      "Nirjara SSR rendering error:",
      error
    );

    next(error);
  }
});

/* ============================================================
   SERVER ERROR HANDLER
============================================================ */

app.use((error, req, res, next) => {
  console.error(
    "Server error:",
    error
  );

  if (res.headersSent) {
    return next(error);
  }

  res
    .status(500)
    .type("html")
    .send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Server Error | Nirjara Beauty</title>
          <meta name="robots" content="noindex" />
        </head>

        <body>
          <h1>Internal Server Error</h1>
          <p>Please try again later.</p>
        </body>
      </html>
    `);
});

/* ============================================================
   START SERVER

   Automatically tries the next available port
   when a development port is already occupied.
============================================================ */

function startServer(port, attempt = 0) {
  if (attempt >= MAX_PORT_ATTEMPTS) {
    console.error(
      `Unable to find an available port after ${
        MAX_PORT_ATTEMPTS
      } attempts.`
    );

    process.exitCode = 1;

    return;
  }

  const server = app.listen(
    port,
    HOST
  );

  server.once("listening", () => {
    const address =
      server.address();

    const actualPort =
      address &&
      typeof address !== "string"
        ? address.port
        : port;

    const localUrl =
      `http://localhost:${actualPort}`;

    console.log(
      "\n========================================"
    );

    console.log(
      "  NIRJARA BEAUTY SALON — React + Vite SSR"
    );

    console.log(
      "========================================"
    );

    console.log(
      `  Local:    ${localUrl}/`
    );

    console.log(
      `  Services: ${localUrl}/services`
    );

    console.log(
      `  Blog:     ${localUrl}/blog`
    );

    console.log(
      `  Events:   ${localUrl}/events`
    );

    console.log(
      `  Port:     ${actualPort}`
    );

    console.log(
      `  Mode:     ${mode}`
    );

    console.log(
      `  API:      ${API_URL}`
    );

    console.log(
      "========================================\n"
    );
  });

  server.once("error", (error) => {
    if (
      !isProduction &&
      error.code === "EADDRINUSE"
    ) {
      console.log(
        `Port ${port} is already in use. Trying port ${
          port + 1
        }...`
      );

      startServer(
        port + 1,
        attempt + 1
      );

      return;
    }

    console.error(
      "Failed to start Nirjara SSR server:",
      error
    );

    process.exitCode = 1;
  });
}

startServer(START_PORT);
