import {useLoaderData} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData() {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="product-container">
      <style>
        {`
          .product-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
          
          .product-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: start;
          }
          
          .product-image-container {
            position: sticky;
            top: 2rem;
          }
          
          .product-details {
            max-width: 500px;
          }
          
          .product-title {
            font-size: 2rem;
            font-weight: 300;
            margin: 0 0 1rem 0;
            color: #000;
            line-height: 1.2;
          }
          
          .product-price {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            color: #333;
          }
          
          .product-form {
            margin-bottom: 3rem;
          }
          
          .product-resources {
            margin: 2rem 0;
            padding: 1.5rem 0;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
          }
          
          .resources-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0 0 1rem 0;
          }
          
          .pdf-links {
            display: flex;
            gap: 2rem;
          }
          
          .pdf-link {
            color: #000;
            text-decoration: none;
            font-size: 0.9rem;
            transition: opacity 0.2s ease;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-family: inherit;
          }
          
          .pdf-link:hover {
            opacity: 0.7;
          }
          
          .description-section {
            margin-top: 2rem;
          }
          
          .description-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0 0 1rem 0;
          }
          
          .description-content {
            color: #333;
            line-height: 1.6;
          }
          
          .description-content p {
            margin: 0 0 1rem 0;
          }
          
          .description-content p:last-child {
            margin-bottom: 0;
          }
          
          @media (max-width: 768px) {
            .product-container {
              padding: 1rem;
            }
            
            .product-layout {
              grid-template-columns: 1fr;
              gap: 2rem;
            }
            
            .product-image-container {
              position: static;
            }
            
            .product-details {
              max-width: none;
            }
            
            .product-title {
              font-size: 1.5rem;
            }
            
            .pdf-links {
              flex-direction: column;
              gap: 0.5rem;
            }
          }
        `}
      </style>

      <div className="product-layout">
        <div className="product-image-container">
          <ProductImage image={selectedVariant?.image} />
        </div>

        <div className="product-details">
          <h1 className="product-title">{title}</h1>

          <div className="product-price">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          <div className="product-form">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>

          <div className="product-resources">
            <h3 className="resources-title">Resources</h3>
            <div className="pdf-links">
              <button
                className="pdf-link"
                onClick={() => {
                  alert('Spec Sheet PDF will be available soon');
                }}
              >
                Spec Sheet (PDF)
              </button>
              <button
                className="pdf-link"
                onClick={() => {
                  alert('CAD Drawing PDF will be available soon');
                }}
              >
                CAD Drawing (PDF)
              </button>
            </div>
          </div>

          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <div
              className="description-content"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          </div>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
