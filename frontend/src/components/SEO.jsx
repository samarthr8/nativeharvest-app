import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  image = "/images/og-default.jpg",
  url
}) {
  const siteName = "NativeHarvest India";
  
  const domain = typeof window !== "undefined" ? window.location.origin : "https://www.nativeharvest.store";
  
  // If the image already starts with "http" (like your S3 links), use it. 
  // Otherwise, attach your domain to the front of the local path.
  const absoluteImage = image.startsWith("http") ? image : `${domain}${image}`;
  
  // Get the current page URL for the preview link
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : domain);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / WhatsApp / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card (Used as a fallback by many messaging apps) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
}