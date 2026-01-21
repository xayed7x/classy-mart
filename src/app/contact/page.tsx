import type { Metadata } from 'next';
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Velora. Visit our outlets in Cumilla, call our customer support, or reach us via email. We\'re here to help you 24/7.',
  keywords: ['contact Velora', 'Velora outlets', 'customer support Bangladesh', 'Cumilla clothing store', 'Lalmai Bazar', 'Ananda City Center'],
  openGraph: {
    title: 'Contact Us | Velora',
    description: 'Visit our outlets in Cumilla or contact our 24/7 customer support. We\'re here to help you find the perfect outfit.',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact Velora',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Velora',
    description: 'Visit our outlets in Cumilla or contact our 24/7 customer support.',
    images: ['/logo.png'],
  },
};

const contactDetails = {
    outlets: [
        {
            name: 'LALMAI BAZAR',
            address: 'Lalmai Bazar, Opposite Of Lalmai College Gate, Lalmai Bazar, Cumilla',
            mapLink: 'https://www.google.com/maps/search/Lalmai+Bazar,+Opposite+Of+Lalmai+College+Gate,+Lalmai+Bazar,+Cumilla',
        },
        {
            name: 'ANANDA CITY CENTER',
            address: 'Ananda City Center, Level-5, Lift-4, Shop-6, Kandirpar, Cumilla',
            mapLink: 'https://www.google.com/maps/search/Ananda+City+Center,+Level-5,+Lift-4,+Shop-6,+Kandirpar,+Cumilla'
        }
    ],
    customerSupport: {
        phoneNumbers: ['+8801626985454', '+8801621518538', '+8801635814979'],
        email: 'classymart.com@gmail.com',
    },
    businessHours: {
        weekdays: 'Every day 24/7',
        weekends: 'Every day 24/7',
    },
    socialMedia: {
        facebook: 'https://www.facebook.com/share/16AYxJpL1d/?mibextid=wwXIfr',
        instagram: 'https://www.instagram.com/classymart2024?igsh=bXAyZm95Z2tramRo&utm_source=qr',
        tiktok: 'https://www.tiktok.com/@classymart3?_t=ZS-90oiQSAg4FJ&_r=1',
        whatsapp: 'https://wa.me/8801304561370',
        telegram: 'https://t.me/+8801304561370',
    },
};

export default function ContactPage() {
    return (
        <div className="bg-background text-foreground font-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-4">
                    {/* Our Outlets Section */}
                    <div className="p-4 pl-4">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center"><MapPin className="mr-3" /> Our Outlets</h2>
                        <div className="space-y-6">
                            {contactDetails.outlets.map((outlet, index) => (
                                <div key={index} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                                    <h3 className="font-bold text-lg">{outlet.name}</h3>
                                    <p className="text-muted-foreground mt-1">{outlet.address}</p>
                                    <Link href={outlet.mapLink} target='_blank' className='text-blue-500 hover:underline mt-2 inline-block'>
                                        View on Map
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center"><Phone className="mr-3" /> Customer Support</h2>
                        <div className="space-y-4 text-lg">
                            <div>
                                {contactDetails.customerSupport.phoneNumbers.map(num => (
                                    <a key={num} href={`tel:${num}`} className="flex items-center space-x-3 group mb-2">
                                        <Phone size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="group-hover:text-primary transition-colors">{num}</span>
                                    </a>
                                ))}
                            </div>
                            
                            {/* WhatsApp & Telegram Contact */}
                            <div className="flex items-center space-x-3 py-2">
                                <div className="flex items-center space-x-2">
                                    <a 
                                        href={contactDetails.socialMedia.whatsapp} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-green-500 hover:scale-110 transition-transform"
                                        title="Chat on WhatsApp"
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                                    </a>
                                    <a 
                                        href={contactDetails.socialMedia.telegram} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:scale-110 transition-transform"
                                        title="Chat on Telegram"
                                    >
                                        <FontAwesomeIcon icon={faTelegram} className="h-6 w-6" />
                                    </a>
                                </div>
                                <span className="text-foreground">+8801304561370</span>
                            </div>
                            
                            <div>
                                <a href={`mailto:${contactDetails.customerSupport.email}`} target="_blank" className="flex items-center space-x-3 group">
                                    <Mail size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="group-hover:text-primary transition-colors">{contactDetails.customerSupport.email}</span>
                                </a>
                            </div>
                        </div>

                        {/* Business Hours Section */}
                        <h2 className="text-2xl font-semibold mt-10 mb-6 flex items-center"><Clock className="mr-3" /> Business Hours</h2>
                        <div className="space-y-2 text-lg">
                            <p><strong className="font-semibold">Hours:</strong> Every day 24/7</p>
                        </div>
                    </div>
                </div>

                {/* Follow Us Section */}
                <div className="pt-4 text-center">
                    <h2 className="text-2xl font-semibold mb-6">Follow Us</h2>
                    <div className="flex justify-center space-x-6">
                        <a href={contactDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-300 hover:scale-110">
                            <Facebook size={32} />
                        </a>
                        <a href={contactDetails.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-300 hover:scale-110">
                            <Instagram size={32} />
                        </a>
                        <a href={contactDetails.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-300 hover:scale-110">
                                <FontAwesomeIcon icon={faTiktok} className="h-8 w-8" />
                            </a>
                        <a href={contactDetails.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-green-500 transition-transform duration-300 hover:scale-110">
                            <FontAwesomeIcon icon={faWhatsapp} className="h-8 w-8" />
                        </a>
                        <a href={contactDetails.socialMedia.telegram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-500 transition-transform duration-300 hover:scale-110">
                            <FontAwesomeIcon icon={faTelegram} className="h-8 w-8" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

