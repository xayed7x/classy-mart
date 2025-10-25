import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

const contactDetails = {
  customerSupport: {
      phoneNumbers: ['+8801626985454', '+8801621518538', '+8801635814979'],
      email: 'classymart.com@gmail.com',
  },
  socialMedia: {
      facebook: 'https://www.facebook.com/share/16AYxJpL1d/?mibextid=wwXIfr',
      instagram: 'https://www.instagram.com/classymart2024?igsh=bXAyZm95Z2tramRo&utm_source=qr',
      tiktok: 'https://www.tiktok.com/@classymart3?_t=ZS-90oiQSAg4FJ&_r=1',
  },
};

/**
 * Main Site Footer Component
 * 
 * Purpose: Comprehensive navigation, trust-building, and information hub
 * 
 * Structure:
 * - 4-column grid (Brand, Shop, About, Support)
 * - Copyright section with payment methods
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border dark:bg-rich-black py-16 sm:py-24 pb-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Classy Mart"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 font-sans text-sm text-foreground/60 hover:text-foreground">
              Redefining modern fashion with curated collections for the contemporary wardrobe.
            </p>
            
            {/* Social Media Icons */}
            <div className="mt-6 flex gap-4">
              <Link
                href={contactDetails.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} strokeWidth={1.5} size="lg" />
              </Link>
              <Link
                href={contactDetails.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} strokeWidth={1.5} size="lg" />
              </Link>
              <Link
                href={contactDetails.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} strokeWidth={1.5} size="lg" />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/collections/t-shirts"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/shirts"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/pants"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Pants
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/panjabis"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Panjabis
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              About
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/story"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>

            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
                {contactDetails.customerSupport.phoneNumbers.map((num, index) => (
                    <li key={index}>
                        <a href={`tel:${num}`} className="font-sans text-sm text-foreground/60 hover:text-foreground">
                            {num}
                        </a>
                    </li>
                ))}
                <li>
                    <a href={`mailto:${contactDetails.customerSupport.email}`} className="font-sans text-sm text-foreground/60 hover:text-foreground">
                        {contactDetails.customerSupport.email}
                    </a>
                </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <hr className="mt-12 border-border" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright Notice */}
          <p className="font-sans text-sm text-muted-foreground">
            © {currentYear} Classy Mart. All Rights Reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-muted-foreground">
              We Accept:
            </span>
            <div className="flex items-center gap-2 font-sans text-xs font-medium text-foreground">
              <div className="relative h-6 w-10">
                <Image src="/icons/bkash.png" alt="bKash" layout="fill" objectFit="contain" />
              </div>
              <div className="relative h-6 w-10">
                <Image src="/icons/nagod.png" alt="Nagad" layout="fill" objectFit="contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}