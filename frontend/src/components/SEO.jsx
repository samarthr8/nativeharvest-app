import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  image = "/images/og-default.jpg"
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}

