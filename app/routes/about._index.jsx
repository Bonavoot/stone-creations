import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export const meta = () => {
  return [{title: 'About Us | Carved & Co.'}];
};

export async function loader() {
  return json({
    seo: {
      title: 'About Us | Carved & Co.',
      description:
        'Learn about Carved & Co., our story, mission, and commitment to quality craftsmanship.',
    },
  });
}

export default function About() {
  const {seo} = useLoaderData();

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>Our Story</h1>
        <p className="subtitle">Crafting Excellence Since 2010</p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            At Carved & Co., we believe in the timeless beauty of handcrafted
            pieces that tell a story. Our mission is to create exceptional,
            sustainable products that bring warmth and character to your home
            while supporting local craftsmanship and American manufacturing.
          </p>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Quality Craftsmanship</h3>
              <p>
                Every piece we create is meticulously crafted by skilled
                artisans who take pride in their work. We never compromise on
                quality, ensuring each item meets our exacting standards.
              </p>
            </div>
            <div className="value-item">
              <h3>Sustainability</h3>
              <p>
                We're committed to sustainable practices, using responsibly
                sourced materials and minimizing our environmental footprint in
                every aspect of our business.
              </p>
            </div>
            <div className="value-item">
              <h3>American Made</h3>
              <p>
                All our products are proudly made in the USA, supporting local
                communities and maintaining the highest standards of
                manufacturing excellence.
              </p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <p>
            Our team of dedicated craftsmen and designers brings decades of
            combined experience in woodworking, design, and manufacturing.
            Together, we're passionate about creating pieces that will become
            cherished parts of your home for generations to come.
          </p>
        </section>
      </div>
    </div>
  );
}
