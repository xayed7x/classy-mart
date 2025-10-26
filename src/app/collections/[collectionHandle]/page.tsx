import type { Metadata } from 'next';
import { getProductsByCollection } from '@/lib/contentful';
import { CollectionPageClient } from '@/components/collections/CollectionPageClient';

interface CollectionPageProps {
  params: {
    collectionHandle: string;
  };
}

// Category configuration for metadata
const COLLECTION_INFO: Record<string, { name: string; description: string }> = {
  all: {
    name: 'All Products',
    description: 'Browse our complete collection of premium men\'s clothing. From casual wear to formal attire, find everything you need at Classy Mart.',
  },
  't-shirts': {
    name: 'T-Shirts Collection',
    description: 'Discover our premium collection of men\'s t-shirts. Comfortable, stylish, and made with quality materials. Shop polo t-shirts, graphic tees, and more.',
  },
  shirts: {
    name: 'Shirts Collection',
    description: 'Explore our exclusive range of men\'s shirts. From casual to formal, find the perfect shirt for any occasion. Premium quality guaranteed.',
  },
  pants: {
    name: 'Pants Collection',
    description: 'Shop our collection of men\'s pants. Formal trousers, casual chinos, and comfortable everyday wear. Quality fabrics and perfect fit.',
  },
  panjabis: {
    name: 'Panjabis Collection',
    description: 'Traditional and modern panjabis for men. Perfect for festivals, weddings, and special occasions. Authentic designs with premium quality.',
  },
  jackets: {
    name: 'Jackets Collection',
    description: 'Stay stylish with our men\'s jacket collection. From casual to formal, find the perfect outerwear for any season.',
  },
  hoodies: {
    name: 'Hoodies Collection',
    description: 'Comfortable and trendy hoodies for men. Perfect for casual wear and layering. Premium quality materials.',
  },
  accessories: {
    name: 'Accessories Collection',
    description: 'Complete your look with our range of men\'s accessories. Quality products to complement your style.',
  },
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const handle = params.collectionHandle;
  const info = COLLECTION_INFO[handle] || {
    name: `${handle.charAt(0).toUpperCase() + handle.slice(1)} Collection`,
    description: `Shop our exclusive collection of premium ${handle} for men at Classy Mart. Online shopping in Bangladesh with cash on delivery.`,
  };

  return {
    title: info.name,
    description: info.description,
    keywords: [
      handle,
      'mens fashion',
      'Bangladesh',
      'online shopping',
      'Classy Mart',
      'premium clothing',
      'buy online BD',
      'cash on delivery',
    ],
    openGraph: {
      title: info.name,
      description: info.description,
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${info.name} - Classy Mart`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: info.name,
      description: info.description,
      images: ['/logo.png'],
    },
    alternates: {
      canonical: `/collections/${handle}`,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const products = await getProductsByCollection(params.collectionHandle);

  return <CollectionPageClient products={products} collectionHandle={params.collectionHandle} />;
}
