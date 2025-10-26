import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/contentful';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://classymart-com.netlify.app'; // Replace with your actual production domain
  
  const products = await getAllProducts();
  const productUrls = products.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Collection slugs based on your product categories
  const collections = ['all', 't-shirts', 'shirts', 'pants', 'panjabis', 'jackets', 'hoodies', 'accessories'];
  const collectionUrls = collections.map(handle => ({
    url: `${baseUrl}/collections/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...collectionUrls,
    ...productUrls,
  ];
}
