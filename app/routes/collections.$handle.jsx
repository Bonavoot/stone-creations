import {redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Stone Creations | ${data?.collection.title ?? ''} Collection`},
  ];
};

// Collection-specific content
const getCollectionContent = (handle) => {
  const collectionData = {
    kitchen: {
      title: 'Kitchen Collection',
      subtitle: 'Transform Your Culinary Space',
      description:
        'Discover our exquisite collection of marble kitchen essentials. From stunning countertops to elegant backsplashes, each piece is crafted to elevate your culinary experience with timeless luxury.',
      hero: 'Create the heart of your home with our premium marble kitchen solutions, designed for both beauty and functionality.',
    },
    bathroom: {
      title: 'Bathroom Collection',
      subtitle: 'Luxury Meets Functionality',
      description:
        'Transform your bathroom into a serene spa-like retreat with our premium marble collection. From vanity tops to shower surrounds, experience the perfect blend of elegance and durability.',
      hero: 'Indulge in daily luxury with marble that transforms your bathroom into a personal sanctuary.',
    },
    living: {
      title: 'Living Room Collection',
      subtitle: 'Sophisticated Living Spaces',
      description:
        'Enhance your living spaces with our curated collection of marble accents. From fireplace surrounds to coffee table tops, create an atmosphere of refined elegance.',
      hero: 'Make a statement with marble pieces that define sophisticated living and timeless style.',
    },
    outdoor: {
      title: 'Outdoor Collection',
      subtitle: 'Exterior Elegance',
      description:
        'Extend luxury beyond your home with our weather-resistant outdoor marble collection. Perfect for patios, outdoor kitchens, and garden features that withstand the elements.',
      hero: 'Bring indoor luxury to your outdoor spaces with durable marble designed for every season.',
    },
  };

  return (
    collectionData[handle] || {
      title: 'Collection',
      subtitle: 'Discover Our Premium Selection',
      description: 'Explore our curated collection of premium marble products.',
      hero: 'Experience the timeless beauty of natural marble.',
    }
  );
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
    collectionContent: getCollectionContent(handle),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData() {
  return {};
}

const containerStyle = {
  width: '90%',
  maxWidth: '1400px',
  margin: '0 auto',
};

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection, collectionContent} = useLoaderData();

  return (
    <div className="collection">
      <div className="collection-header">
        <style>
          {`
            .collection-header {
              background-color: #f8f8f8;
              padding: 6rem 0;
              margin-bottom: 4rem;
              text-align: center;
            }
            
            .collection-header h1 {
              font-size: 3rem;
              font-weight: 300;
              margin-bottom: 0.5rem;
              letter-spacing: 0.02em;
            }
            
            .collection-header .subtitle {
              font-size: 1.3rem;
              color: #666;
              margin-bottom: 2rem;
              font-weight: 300;
              letter-spacing: 0.05em;
            }
            
            .collection-header .hero-text {
              font-size: 1.1rem;
              line-height: 1.8;
              color: #555;
              max-width: 700px;
              margin: 0 auto 2rem;
              font-style: italic;
            }
            
            .collection-header .description {
              font-size: 1rem;
              line-height: 1.8;
              color: #666;
              max-width: 600px;
              margin: 0 auto;
            }
            
            @media (max-width: 768px) {
              .collection-header {
                padding: 4rem 0;
              }
              
              .collection-header h1 {
                font-size: 2rem;
              }
              
              .collection-header .subtitle {
                font-size: 1.1rem;
              }
            }
          `}
        </style>
        <h1>{collectionContent.title}</h1>
        <div className="subtitle">{collectionContent.subtitle}</div>
        <p className="hero-text">{collectionContent.hero}</p>
        <p className="description">{collectionContent.description}</p>
      </div>

      <div style={containerStyle}>
        {collection.products.nodes.length > 0 ? (
          <PaginatedResourceSection
            connection={collection.products}
            resourcesClassName="products-grid"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 12 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <div style={{textAlign: 'center', padding: '4rem 0'}}>
            <p
              style={{fontSize: '1.2rem', color: '#666', marginBottom: '2rem'}}
            >
              No products found in this collection yet.
            </p>
            <p style={{color: '#888'}}>
              Check back soon for new arrivals, or explore our{' '}
              <Link
                to="/collections/all"
                style={{color: '#333', textDecoration: 'underline'}}
              >
                complete collection
              </Link>
              .
            </p>
          </div>
        )}
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <style>
        {`
          .product-item {
            text-decoration: none;
            color: inherit;
            transition: transform 0.3s ease;
            display: block;
          }
          
          .product-item:hover {
            transform: translateY(-5px);
          }
          
          .product-image {
            position: relative;
            aspect-ratio: 1/1;
            overflow: hidden;
            margin-bottom: 1rem;
          }
          
          .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .product-item:hover .product-image img {
            transform: scale(1.05);
          }
          
          .product-info {
            text-align: left;
          }
          
          .product-info h4 {
            font-size: 1.1rem;
            font-weight: 400;
            margin: 0.5rem 0;
            letter-spacing: 0.05em;
          }
          
          .product-info small {
            color: #666;
            font-size: 0.9rem;
          }
        `}
      </style>

      <div className="product-image">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
      </div>
      <div className="product-info">
        <h4>{product.title}</h4>
        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
