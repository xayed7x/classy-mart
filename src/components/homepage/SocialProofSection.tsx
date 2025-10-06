import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

/**
 * Social Proof Section Component - Instagram Feed Integration
 * 
 * Purpose: Build trust and community by showcasing brand's Instagram presence
 * 
 * Mobile: 2-column grid
 * Desktop: 4-5 column grid with hover overlays
 */

// Hardcoded Instagram posts data
const instagramPosts = [
  {
    id: 1,
    imageUrl: "/images/tshirt2.png",
    postUrl: "https://instagram.com/p/example1",
    alt: "Classy Mart Instagram Post 1",
  },
  {
    id: 2,
    imageUrl: "/images/shirt1.png",
    postUrl: "https://instagram.com/p/example2",
    alt: "Classy Mart Instagram Post 2",
  },
  {
    id: 3,
    imageUrl: "/images/shirt2.png",
    postUrl: "https://instagram.com/p/example3",
    alt: "Classy Mart Instagram Post 3",
  },
  {
    id: 4,
    imageUrl: "/images/shirt3.png",
    postUrl: "https://instagram.com/p/example4",
    alt: "Classy Mart Instagram Post 4",
  },
  {
    id: 5,
    imageUrl: "/images/panjabi.webp",
    postUrl: "https://instagram.com/p/example5",
    alt: "Classy Mart Instagram Post 5",
  },
];

export function SocialProofSection() {
  return (
    <section className="bg-background px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Join the Community
          </h2>
          
          {/* Instagram Handle Link */}
          <Link
            href="https://instagram.com/classymart"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-sans text-lg font-medium text-foreground transition-colors hover:text-primary"
          >
            <Instagram strokeWidth={1.5} size={24} />
            <span>@classymart</span>
          </Link>
        </div>

      {/* Instagram Grid */}
      <div className="mt-12 grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {instagramPosts.map((post) => (
          <Link
            key={post.id}
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            {/* Post Image */}
            <Image
              src={post.imageUrl}
              alt={post.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 20vw"
            />

            {/* Hover Overlay (Desktop-Only) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram strokeWidth={1.5} size={32} className="text-white" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
