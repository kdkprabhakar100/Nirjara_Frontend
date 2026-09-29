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
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://nirjarabeauty.com";

export default function SEO({
  title,
  description,
  keywords = "",
  canonical = "/",
  image = "/images/nirjara-og.jpg",
  type = "website",
  noindex = false,
}: SEOProps) {
  const canonicalUrl = canonical.startsWith("http")
    ? canonical
    : `${SITE_URL}${canonical}`;

  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* BASIC SEO */}
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {noindex && (
        <meta
          name="robots"
          content="noindex,nofollow"
        />
      )}

      {/* OPEN GRAPH */}
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description}
      />
      <meta
        property="og:type"
        content={type}
      />
      <meta
        property="og:url"
        content={canonicalUrl}
      />
      <meta
        property="og:image"
        content={imageUrl}
      />
      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      {/* TWITTER */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:title"
        content={title}
      />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={imageUrl}
      />
    </Helmet>
  );
}