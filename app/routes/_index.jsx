import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
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
  width: '75%',
  maxWidth: '1200px',
  margin: '0 auto 2rem auto',
};

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <HeroBanner />
      <div style={{...containerStyle, marginTop: '2rem'}}>
        <FeaturedCollection collection={data.featuredCollection} />
      </div>
      <div style={containerStyle}>
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
          /* Default for larger screens - 75% width */
          .hero-banner-container {
            position: relative;
            width: 75%;
            margin: 0 auto 2rem auto;
            overflow: hidden;
            border-radius: 4px;
          }
          
          /* For smaller screens - 100% width */
          @media (max-width: 45em) {
            .hero-banner-container {
              width: 100%;
              border-radius: 0;
            }
            .hero-text {
              text-align: center;
              align-items: center;
            }
            .hero-text h1, .hero-text p {
              max-width: 80%;
              margin-left: auto;
              margin-right: auto;
            }
            .hero-text h1 {
              font-size: 1.5rem;
            }
            .hero-text p {
              font-size: 1rem;
            }
          }
          
          .hero-image {
            width: 100%;
            height: auto;
            display: block;
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
            align-items: center;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%);
            color: white;
          }
          
          .hero-text h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            max-width: 50%;
          }
          
          .hero-text p {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            max-width: 50%;
          }
          
          .shop-button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: white;
            color: black;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            transition: all 0.2s ease;
          }
          
          .shop-button:hover {
            background-color: #f0f0f0;
            transform: translateY(-2px);
          }
        `}
      </style>

      <div className="hero-banner-container">
        <img
          className="hero-image"
          src="/landing-page-kitchen.png"
          alt="Modern Kitchen"
        />

        <div className="hero-text">
          <h1>Elegant Home Essentials</h1>
          <p>
            Discover our curated collection of premium products for your home
          </p>
          <div>
            <Link className="shop-button" to="/collections/all">
              Shop All
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
      <Link
        className="featured-collection"
        to={`/collections/${collection.handle}`}
        style={{display: 'block', textAlign: 'center'}}
      >
        {image && (
          <div className="featured-collection-image" style={{margin: '0 auto'}}>
            <Image data={image} sizes="100vw" />
          </div>
        )}
        {/* <h1>{collection.title}</h1> */}
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
      <h2 style={{textAlign: 'left'}}>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div
              className="recommended-products-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                margin: '0 auto',
              }}
            >
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                      style={{textDecoration: 'none', color: 'inherit'}}
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
      <br />
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
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
