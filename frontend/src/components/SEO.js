import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "TeIpsum - Sustainable Fashion Store",
  description = "Discover sustainable fashion at TeIpsum. Shop our eco-friendly clothing collection featuring timeless designs, ethical production, and premium quality materials.",
  keywords = "sustainable fashion, eco-friendly clothing, ethical fashion, sustainable clothing, organic fashion, TeIpsum",
  canonicalUrl = "",
  image = "/images/teipsum-og-image.jpg",
  imageAlt = "TeIpsum Sustainable Fashion Collection",
  type = "website",
  author = "TeIpsum",
  publishedTime = "",
  modifiedTime = "",
  noIndex = false,
  noFollow = false,
  structuredData = null
}) => {
  const siteUrl = "https://teipsum.com";
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const baseTitle = "TeIpsum";
  const fullTitle = title === baseTitle ? title : `${title} | ${baseTitle}`;

  const robotsContent = `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="TeIpsum" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <meta name="twitter:site" content="@TeIpsum" />
      <meta name="twitter:creator" content="@TeIpsum" />

      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Default Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TeIpsum",
          "url": siteUrl,
          "logo": `${siteUrl}/images/logo.png`,
          "description": "Sustainable fashion brand creating eco-friendly clothing with timeless designs and ethical production practices.",
          "foundingDate": "2020",
          "founders": [{
            "@type": "Person",
            "name": "Andrii Dovhal"
          }],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Fashion Street",
            "addressLocality": "Łódź",
            "addressCountry": "PL",
            "postalCode": "90-001"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+48-123-456-789",
            "contactType": "customer service",
            "availableLanguage": ["English", "Polish"]
          },
          "sameAs": [
            "https://www.facebook.com/teipsum",
            "https://www.instagram.com/teipsum",
            "https://www.twitter.com/teipsum"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 