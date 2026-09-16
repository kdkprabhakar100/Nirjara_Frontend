const fs = require("fs");
const path = require("path");

const BASE_URL = "https://nirjarabeautysalon.com";
const API_URL = "https://nirjarabeautysalon.onrender.com";

const staticRoutes = [
  "",
  "/services",
  "/gallery",
  "/branches",
  "/academy",
  "/blog",
  "/contact",
  "/booking",
  "/products",
  "/events",
  "/careers",
];

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function generateSitemap() {
  const blogs = await fetchData("/api/blogs");
  const products = await fetchData("/api/products");
  const events = await fetchData("/api/events");

  const urls = [
    ...staticRoutes.map((route) => `${BASE_URL}${route}`),

    ...blogs.map((blog) => `${BASE_URL}/blog/${blog._id}`),

    ...products.map((product) => `${BASE_URL}/products/${product._id}`),

    ...events.map((event) => `${BASE_URL}/events/${event._id}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync(
    path.join(__dirname, "../public/sitemap.xml"),
    sitemap
  );

  console.log("✅ sitemap.xml generated");
}

generateSitemap();