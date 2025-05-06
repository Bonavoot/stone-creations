import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Stone Creations | Luxury Marble Products'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

// Common container style to be used for product sections
const containerStyle = {
  width: '90%',
  maxWidth: '1400px',
  margin: '0 auto',
};

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <HeroBanner />
      <div style={{...containerStyle, marginTop: '4rem'}}>
        <FeaturedCollection collection={data.featuredCollection} />
      </div>
      <div style={{...containerStyle, marginTop: '6rem'}}>
        <DesignerSection />
      </div>
      <div style={{...containerStyle, marginTop: '6rem'}}>
        <CraftsmanshipSection />
      </div>
      <div style={{...containerStyle, marginTop: '6rem', marginBottom: '6rem'}}>
        <RecommendedProducts products={data.recommendedProducts} />
      </div>
    </div>
  );
}

/**
 * Hero banner component with static image and text overlay
 */
function HeroBanner() {
  return (
    <div>
      <style>
        {`
          .hero-banner-container {
            position: relative;
            width: 100%;
            height: 90vh;
            overflow: hidden;
          }
          
          .hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .hero-text {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 4rem;
            background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%);
            color: white;
          }
          
          .hero-text h1 {
            font-size: 3.5rem;
            font-weight: 300;
            margin-bottom: 1.5rem;
            max-width: 600px;
            line-height: 1.2;
            letter-spacing: 0.02em;
          }
          
          .hero-text p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            max-width: 500px;
            line-height: 1.6;
            font-weight: 300;
          }
          
          .shop-button {
            display: inline-block;
            padding: 1rem 2rem;
            background-color: transparent;
            color: white;
            text-decoration: none;
            border: 1px solid white;
            font-weight: 400;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            transition: all 0.3s ease;
          }
          
          .shop-button:hover {
            background-color: white;
            color: black;
          }

          @media (max-width: 768px) {
            .hero-text {
              padding: 2rem;
              align-items: center;
              text-align: center;
            }
            
            .hero-text h1 {
              font-size: 2rem;
            }
            
            .hero-text p {
              font-size: 1rem;
            }
          }
        `}
      </style>

      <div className="hero-banner-container">
        <img
          className="hero-image"
          src="/landing-page-kitchen.png"
          alt="Luxury Marble Kitchen"
        />

        <div className="hero-text">
          <h1>Artisanal Marble Creations for Discerning Spaces</h1>
          <p>
            Exclusively crafted for interior designers and luxury residential
            projects. Each piece tells a story of timeless elegance and
            unparalleled craftsmanship.
          </p>
          <div>
            <Link className="shop-button" to="/collections/all">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <div style={{textAlign: 'center'}}>
      <style>
        {`
          .featured-collection {
            position: relative;
            margin-bottom: 2rem;
          }
          
          .featured-collection-image {
            aspect-ratio: 16/9;
            overflow: hidden;
          }
          
          .featured-collection img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .featured-collection-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 2rem;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            color: white;
            text-align: left;
          }
          
          .featured-collection-overlay h2 {
            font-size: 2rem;
            font-weight: 300;
            margin-bottom: 1rem;
          }
          
          .featured-collection-overlay p {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            max-width: 500px;
          }
        `}
      </style>

      <Link
        className="featured-collection"
        to={`/collections/${collection.handle}`}
      >
        {image && (
          <div className="featured-collection-image">
            <Image data={image} sizes="100vw" />
            <div className="featured-collection-overlay">
              <h2>{collection.title}</h2>
              <p>
                Discover our signature collection of premium marble products
              </p>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products" style={{textAlign: 'center'}}>
      <style>
        {`
          .recommended-products h2 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 3rem;
            letter-spacing: 0.02em;
          }
          
          .recommended-products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 0 auto;
          }
          
          .recommended-product {
            text-decoration: none;
            color: inherit;
            transition: transform 0.3s ease;
          }
          
          .recommended-product:hover {
            transform: translateY(-5px);
          }
          
          .recommended-product img {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            margin-bottom: 1rem;
          }
          
          .recommended-product h4 {
            font-size: 1.1rem;
            font-weight: 400;
            margin: 0.5rem 0;
            letter-spacing: 0.05em;
          }
          
          .recommended-product small {
            color: #666;
            font-size: 0.9rem;
          }
        `}
      </style>

      <h2>Curated Selection</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function DesignerSection() {
  return (
    <div style={{textAlign: 'center', padding: '4rem 0'}}>
      <style>
        {`
          .designer-section {
            background-color: #f8f8f8;
            padding: 4rem 0;
          }
          
          .designer-content {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .designer-content h2 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 2rem;
            letter-spacing: 0.02em;
          }
          
          .designer-content p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #666;
            margin-bottom: 2rem;
          }
          
          .designer-features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-top: 3rem;
          }
          
          .feature-item {
            padding: 2rem;
          }
          
          .feature-item h3 {
            font-size: 1.2rem;
            font-weight: 400;
            margin: 1rem 0;
            letter-spacing: 0.05em;
          }
          
          .feature-item p {
            font-size: 0.9rem;
            color: #666;
          }
          
          @media (max-width: 768px) {
            .designer-features {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="designer-section">
        <div className="designer-content">
          <h2>Designed for Designers</h2>
          <p>
            We understand the unique needs of interior designers and architects.
            Our marble products are crafted to meet the highest standards of
            luxury residential projects, offering unparalleled customization and
            quality.
          </p>

          <div className="designer-features">
            <div className="feature-item">
              <h3>Custom Dimensions</h3>
              <p>
                Tailored to your exact specifications for perfect integration
                into any space.
              </p>
            </div>
            <div className="feature-item">
              <h3>Premium Materials</h3>
              <p>
                Sourced from the finest quarries worldwide, ensuring exceptional
                quality and beauty.
              </p>
            </div>
            <div className="feature-item">
              <h3>Designer Support</h3>
              <p>
                Dedicated assistance for material selection, customization, and
                project planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CraftsmanshipSection() {
  return (
    <div style={{textAlign: 'center', padding: '4rem 0'}}>
      <style>
        {`
          .craftsmanship-section {
            background-color: white;
          }
          
          .craftsmanship-content {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .craftsmanship-content h2 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 2rem;
            letter-spacing: 0.02em;
          }
          
          .craftsmanship-content p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #666;
            margin-bottom: 2rem;
          }
          
          .craftsmanship-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin-top: 3rem;
          }
          
          .craftsmanship-item {
            position: relative;
            overflow: hidden;
            aspect-ratio: 4/3;
          }
          
          .craftsmanship-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .craftsmanship-item:hover img {
            transform: scale(1.05);
          }
          
          @media (max-width: 768px) {
            .craftsmanship-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="craftsmanship-section">
        <div className="craftsmanship-content">
          <h2>The Art of Craftsmanship</h2>
          <p>
            Each piece is meticulously crafted by master artisans, combining
            traditional techniques with modern precision. Our commitment to
            excellence ensures that every detail meets the highest standards of
            luxury.
          </p>

          <div className="craftsmanship-grid">
            <div className="craftsmanship-item">
              <img src="/craftsmanship-1.jpg" alt="Master Craftsmanship" />
            </div>
            <div className="craftsmanship-item">
              <img src="/craftsmanship-2.jpg" alt="Precision Engineering" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
