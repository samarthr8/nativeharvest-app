import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  image = "/images/og-default.jpg",
  url,
  type = "website",
  jsonLd
}) {
  const siteName = "NativeHarvest India";

  const domain = typeof window !== "undefined" ? window.location.origin : "https://www.nativeharvest.store";

  const absoluteImage = image.startsWith("http") ? image : `${domain}${image}`;

  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : domain);

  // Strip query params and hash for canonical URL
  const canonicalUrl = currentUrl.split("?")[0].split("#")[0];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / WhatsApp / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card (Used as a fallback by many messaging apps) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Structured Data (JSON-LD) — supports single object or array */}
      {jsonLd && (Array.isArray(jsonLd)
        ? jsonLd.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))
        : (
            <script type="application/ld+json">
              {JSON.stringify(jsonLd)}
            </script>
          )
      )}
    </Helmet>
  );
}