/**
 * DEMO SOCIAL POSTS DATA
 * ======================
 * 
 * ডেমো মোডে Social Proof Section এর জন্য হার্ডকোড ডাটা।
 * Dynamic মোডে এই ডাটা Contentful থেকে আসবে।
 */

export interface DemoSocialPost {
  id: string;
  image: string;
  postLink: string;
}

export const DEMO_SOCIAL_POSTS: DemoSocialPost[] = [
  {
    id: "social-1",
    image: "/images/shirt.png",
    postLink: "https://instagram.com/classymart",
  },
  {
    id: "social-2",
    image: "/images/polo-tshirt.png",
    postLink: "https://instagram.com/classymart",
  },
  {
    id: "social-3",
    image: "/images/panjabi.webp",
    postLink: "https://instagram.com/classymart",
  },
  {
    id: "social-4",
    image: "/images/shirt1.png",
    postLink: "https://instagram.com/classymart",
  },
  {
    id: "social-5",
    image: "/images/shirt2.png",
    postLink: "https://instagram.com/classymart",
  },
  {
    id: "social-6",
    image: "/images/shirt3.png",
    postLink: "https://instagram.com/classymart",
  },
];
