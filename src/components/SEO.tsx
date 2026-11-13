
import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
};

const SITE_NAME = "Nirjara Beauty";
const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  "https://nirjarabeautysalon.com"
).replace(/\/+$/, "");

const DEFAULT_IMAGE = "/images/nirjara-og.jpg";

function getAbsoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const path = value.startsWith("/") ? value : `/${value}`;

  return `${SITE_URL}${path}`;
}

export default function SEO({
  title,
  description,
  keywords = "",
  canonical = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}: SEOProps) {
  const cleanTitle =
    title.trim() || "Nirjara Beauty Salon";

  const cleanDescription =
    description.trim() ||
    "Discover beauty services, academy courses, and beauty products at Nirjara Beauty Salon.";

  const canonicalUrl = getAbsoluteUrl(canonical);

  const imageUrl = getAbsoluteUrl(image);

  const robots = noindex
    ? "noindex,follow"
    : "index,follow";

  return (
    <Helmet>
      {/* Main SEO */}
      <title>{cleanTitle}</title>

      <meta
        name="description"
        content={cleanDescription}
      />

      {keywords.trim() && (
        <meta
          name="keywords"
          content={keywords.trim()}
        />
      )}

      <meta
        name="robots"
        content={robots}
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}
      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:title"
        content={cleanTitle}
      />

      <meta
        property="og:description"
        content={cleanDescription}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={cleanTitle}
      />

      <meta
        name="twitter:description"
        content={cleanDescription}
      />

      <meta
        name="twitter:image"
        content={imageUrl}
      />
    </Helmet>
  );
}
