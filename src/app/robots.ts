import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/account/'],
    },
    sitemap: 'https://classymart-com.netlify.app//sitemap.xml', // Replace with your actual production domain
  };
}
