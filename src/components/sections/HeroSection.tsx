import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"; // Assuming Shadcn/UI button
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  imageUrl: string;
  headline: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
}

/**
 * Renders the main hero section for the homepage.
 *
 * @param {HeroSectionProps} props - The properties for the hero section.
 * @returns {React.ReactElement} The HeroSection component.
 */
export function HeroSection({
  imageUrl,
  headline,
  subheading,
  ctaText,
  ctaLink,
}: HeroSectionProps): React.ReactElement {
  return (
    <section
      aria-label="Hero Section"
      className="relative h-[calc(100vh-4rem)] w-full"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/shirt.png"// Ensure this image exists in the public/images directory
          alt="Promotional banner for Classy Mart's new collection"
          fill
          className="object-cover object-center"
          priority // This is the new LCP element, so 'priority' is essential.
          quality={90} // Fine-tune quality for performance.
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-dark-text">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-tighter text-dark-text sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="font-sans mt-4 max-w-xl text-lg text-dark-text/90">
          {subheading}
        </p>
        <Link
          href={ctaLink}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-8 bg-brand-red text-white dark:bg-brand-green dark:text-dark-bg" // Explicitly using our Brand Red
          )}
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
