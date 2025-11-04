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
    // Main categories
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
    barware: {
      title: 'Barware Collection',
      subtitle: 'Refined Entertaining Essentials',
      description:
        'Elevate your home bar with artisanal marble accessories designed for sophisticated entertaining. From coasters to bar tools, explore pieces that balance elegance and function.',
      hero: 'Host beautifully with barware that adds a polished, modern touch to every pour.',
    },

    // Kitchen sub-categories
    'cutting-boards': {
      title: 'Cutting Boards',
      subtitle: 'Artisan Kitchen Essentials',
      description:
        'Elevate your culinary preparation with our handcrafted marble cutting boards. Each piece combines functionality with stunning natural beauty, creating kitchen tools that are as elegant as they are practical.',
      hero: 'Transform meal preparation into an art form with cutting boards that blend durability with timeless sophistication.',
    },
    bowls: {
      title: 'Bowls Collection',
      subtitle: 'Elegant Serving Solutions',
      description:
        'Discover our collection of hand-carved marble bowls, perfect for both everyday use and special occasions. Each bowl showcases the natural beauty of stone while providing exceptional functionality.',
      hero: 'Serve in style with bowls that bring natural elegance to every meal and gathering.',
    },
    // Barware sub-categories
    coasters: {
      title: 'Coasters',
      subtitle: 'Protective Elegance',
      description:
        'Protect surfaces in style with premium marble coasters. Thoughtfully crafted to be both durable and visually striking, they’re an essential detail for any bar or living space.',
      hero: 'Add a refined finish to every setting with coasters that combine practicality and design.',
    },

    // Bathroom sub-categories
    'soap-dishes': {
      title: 'Soap Dishes',
      subtitle: 'Bathroom Luxury Details',
      description:
        'Complete your bathroom sanctuary with our elegant marble soap dishes. These carefully crafted accessories add a touch of luxury to your daily routine while providing practical functionality.',
      hero: 'Transform everyday moments into luxurious experiences with sophisticated soap dishes.',
    },
    'waste-baskets': {
      title: 'Waste Baskets',
      subtitle: 'Functional Bathroom Elegance',
      description:
        "Our marble waste baskets combine practical necessity with refined aesthetics. These elegant bathroom accessories ensure that even the most utilitarian items contribute to your space's sophisticated design.",
      hero: 'Maintain the beauty of your bathroom sanctuary with waste baskets that complement your refined taste.',
    },

    // Living Room sub-categories
    'coffee-tables': {
      title: 'Coffee Tables',
      subtitle: 'Living Room Centerpieces',
      description:
        'Anchor your living space with our stunning marble coffee tables. Each piece serves as both functional furniture and sculptural art, creating a focal point that defines sophisticated living.',
      hero: 'Make a statement with coffee tables that blend architectural beauty with everyday functionality.',
    },
    'light-fixtures': {
      title: 'Light Fixtures',
      subtitle: 'Illuminated Elegance',
      description:
        'Cast beautiful light through our marble light fixtures, where natural stone meets modern illumination. These unique pieces create ambient lighting while serving as stunning decorative elements.',
      hero: 'Illuminate your space with fixtures that transform light into living art.',
    },

    // Outdoor sub-categories
    planters: {
      title: 'Planters',
      subtitle: 'Garden Sophistication',
      description:
        'Bring elegance to your outdoor spaces with our weather-resistant marble planters. These statement pieces provide the perfect foundation for your plants while adding architectural interest to patios, gardens, and terraces.',
      hero: 'Cultivate beauty in your outdoor spaces with planters that elevate both your plants and your landscape design.',
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

  // Define sub-category to parent category mapping
  const subCategoryMap = {
    // Kitchen
    'cutting-boards': 'kitchen',
    bowls: 'kitchen',
    'mortar-and-pestle': 'kitchen',
    'rolling-pins': 'kitchen',

    // Barware
    coasters: 'barware',
    'serving-boards': 'barware',

    // Bathroom
    'soap-dishes': 'bathroom',
    'waste-baskets': 'bathroom',
    'marble-toothbrush-holders': 'bathroom',
    'countertop-trays': 'bathroom',

    // Living Room
    'coffee-tables': 'living',
    'light-fixtures': 'living',
    'marble-bookends': 'living',
    'marble-side-tables': 'living',

    // Outdoor
    planters: 'outdoor',
    'garden-benches': 'outdoor',
    'bird-baths': 'outdoor',
  };

  let collection = null;
  let fallbackHandle = null;

  try {
    // Try to fetch the specific collection first
    const result = await storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    });
    collection = result.collection;
  } catch {
    console.warn(`Collection ${handle} not found, trying fallback...`);
  }

  // If collection doesn't exist and it's a sub-category, try the parent category
  if (!collection && subCategoryMap[handle]) {
    fallbackHandle = subCategoryMap[handle];
    try {
      const fallbackResult = await storefront.query(COLLECTION_QUERY, {
        variables: {handle: fallbackHandle, ...paginationVariables},
      });
      collection = fallbackResult.collection;
    } catch {
      console.warn(`Fallback collection ${fallbackHandle} also not found`);
    }
  }

  // If still no collection found, try 'all' as final fallback
  if (!collection) {
    try {
      const allResult = await storefront.query(COLLECTION_QUERY, {
        variables: {handle: 'all', ...paginationVariables},
      });
      collection = allResult.collection;
    } catch {
      console.warn('All collections fallback also failed');
    }
  }

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // Ensure specific products appear in certain collections even if not assigned in Shopify
  // Currently: ensure the waste-basket product appears in the bathroom collection listing
  if (handle === 'bathroom') {
    try {
      const existingHandles = new Set(
        (collection.products?.nodes ?? []).map((p) => p.handle),
      );
      if (!existingHandles.has('waste-basket')) {
        const PRODUCT_BY_HANDLE_FOR_COLLECTION = `#graphql
          ${PRODUCT_ITEM_FRAGMENT}
          query ProductForCollection($handle: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
            product(handle: $handle) { ...ProductItem }
          }
        `;
        const extra = await storefront.query(PRODUCT_BY_HANDLE_FOR_COLLECTION, {
          variables: {handle: 'waste-basket'},
        });
        const extraProduct = extra?.product;
        if (extraProduct?.id) {
          collection = {
            ...collection,
            products: {
              ...collection.products,
              nodes: [...(collection.products?.nodes ?? []), extraProduct],
            },
          };
        }
      }
    } catch {
      console.warn('Failed to augment bathroom collection with waste-basket');
    }
  }

  return {
    collection,
    collectionContent: getCollectionContent(handle),
    isSubCategory: !!subCategoryMap[handle],
    parentCategory: subCategoryMap[handle],
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
  const {collection, collectionContent, isSubCategory, parentCategory} =
    useLoaderData();

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
            
            .collection-fallback-notice {
              background: #fff9c4;
              border: 1px solid #ffd700;
              border-radius: 4px;
              padding: 1rem;
              margin: 2rem auto;
              max-width: 600px;
              color: #8b7400;
              font-size: 0.9rem;
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
        {isSubCategory && (
          <div className="collection-fallback-notice">
            <p>
              <strong>Note:</strong> We&apos;re currently building our specific{' '}
              {collectionContent.title.toLowerCase()} collection. In the
              meantime, explore our {parentCategory} collection below to
              discover relevant products.
            </p>
          </div>
        )}
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
