import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <div className="bg-background text-soft-white font-sans py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Hero Section */}
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-center mb-12 leading-tight">
          Our Story: Redefining Authentic Luxury in Bangladesh
        </h1>

        {/* Introduction */}
        <p className="text-lg md:text-xl text-center mb-16 text-muted-gold">
          Welcome to Classy Mart, where passion meets precision in every stitch and design.
        </p>

        {/* Section 1: The Spark (The "Why") */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
            The Spark <span className="text-muted-gold">(The "Why")</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            It started with a simple frustration: why is it so hard to find 
            <span className="text-muted-gold font-semibold">genuinely authentic, high-quality clothing</span> in Bangladesh without paying an exorbitant price? 
            We saw a market flooded with compromises—good designs with poor fabrics, or great fabrics with outdated styles. 
            We knew you deserved better.
          </p>
        </section>

        <hr className="border-muted-gold/30 my-12" />

        {/* Section 2: The Craft (The "How") */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
            The Craft <span className="text-muted-gold">(The "How")</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            <span className="text-muted-gold font-semibold">"Classy Mart" is not just a store; it's a curation.</span> 
            We don't just "import products"; we hand-select pieces that meet our rigorous standards. 
            From the weight of our cotton to the precision of every stitch, 
            we are <span className="text-muted-gold font-semibold">obsessed with the details.</span> 
            We believe true luxury isn't about a logo; it's about how a garment feels against your skin and how it makes you feel when you wear it.
          </p>
        </section>

        <hr className="border-muted-gold/30 my-12" />

        {/* Section 3: The Promise (The "What's Next") */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
            The Promise <span className="text-muted-gold">(The "What's Next")</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            We promise <span className="text-muted-gold font-semibold">transparency.</span> What you see is exactly what you get. 
            We promise support—we are here for you long after your purchase is delivered. 
            Our mission is simple: to be the only place you trust when you want to look and feel your absolute best. 
            Welcome to the new standard of authentic style.
          </p>
        </section>

        {/* Final Call to Action */}
        <div className="text-center mt-20">
          <Link
            href="/collections/all"
            className="inline-block bg-primary text-rich-black font-bold font-heading px-8 py-4 rounded-full text-lg uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
          >
            Explore Our Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
