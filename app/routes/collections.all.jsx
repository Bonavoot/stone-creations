import {useLoaderData, Link} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = () => {
  return [{title: 'Stone Creations | Our Collection'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}) {
  return {};
}

const containerStyle = {
  width: '90%',
  maxWidth: '1400px',
  margin: '0 auto',
};

export default function Collection() {
  const {products} = useLoaderData();

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
              margin-bottom: 1.5rem;
              letter-spacing: 0.02em;
            }
            
            .collection-header p {
              font-size: 1.1rem;
              line-height: 1.8;
              color: #666;
              max-width: 600px;
              margin: 0 auto;
            }
          `}
        </style>
        <h1>Our Collection</h1>
        <p>
          Discover our curated selection of premium marble products, each piece
          meticulously crafted to meet the highest standards of luxury and
          design.
        </p>
      </div>

      <div style={containerStyle}>
        <PaginatedResourceSection
          connection={products}
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
      </div>
    </div>
  );
}

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

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
