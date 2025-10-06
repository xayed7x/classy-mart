import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
        Coming Soon
      </h1>
      <p className="font-sans mt-4 max-w-md text-lg text-muted-foreground">
        This page is under construction. We are working hard to bring you an amazing experience.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Go back to Homepage
      </Link>
    </div>
  );
}