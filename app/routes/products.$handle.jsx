import {useLoaderData, Link} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {Image, Money} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductGallery} from '~/components/ProductGallery';
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

  const tryHandles = [
    handle,
    // common singular/plural/slug variants
    handle.replace(/s$/, ''),
    handle.replace(/-s$/, ''),
    handle.replace(/-and-/, '-&-'),
    handle.replace(/&/g, 'and'),
  ].filter((h, idx, arr) => !!h && arr.indexOf(h) === idx);

  let product = null;
  for (const h of tryHandles) {
    const result = await storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: h,
        selectedOptions: getSelectedProductOptions(request),
      },
    });
    if (result?.product?.id) {
      product = result.product;
      break;
    }
  }

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // Determine primary category collection (e.g., kitchen, bathroom, living, outdoor, barware)
  const CATEGORY_HANDLES = [
    'kitchen',
    'bathroom',
    'living',
    'outdoor',
    'barware',
  ];
  const PRIMARY_COLLECTION_OVERRIDES = {
    'waste-basket': 'bathroom',
  };
  const productCollections = product?.collections?.nodes ?? [];
  let primaryCollection =
    productCollections.find((c) => CATEGORY_HANDLES.includes(c.handle)) || null;
  if (!primaryCollection) {
    const overrideHandle = PRIMARY_COLLECTION_OVERRIDES[product.handle];
    if (overrideHandle) {
      primaryCollection = {handle: overrideHandle, title: overrideHandle};
    } else {
      // Avoid picking homepage/frontpage if present; otherwise fallback to first
      primaryCollection =
        productCollections.find(
          (c) => c.handle !== 'frontpage' && c.handle !== 'home',
        ) ||
        productCollections[0] ||
        null;
    }
  }

  let relatedCollection = null;
  let relatedProducts = [];

  if (primaryCollection?.handle) {
    try {
      const relatedResult = await storefront.query(
        RELATED_COLLECTION_PRODUCTS_QUERY,
        {
          variables: {handle: primaryCollection.handle, first: 12},
        },
      );
      if (relatedResult?.collection) {
        relatedCollection = {
          handle: relatedResult.collection.handle,
          title: relatedResult.collection.title,
        };
        relatedProducts = relatedResult.collection.products?.nodes ?? [];
      }
    } catch {
      console.warn('Failed to load related collection products');
    }
  }

  // Ensure Waste Basket shows in "More in Bathroom" even if not in Shopify collection
  if (relatedCollection?.handle === 'bathroom') {
    try {
      const handlesSet = new Set((relatedProducts ?? []).map((p) => p.handle));
      if (!handlesSet.has('waste-basket')) {
        const PRODUCT_BY_HANDLE_FOR_RELATED = `#graphql
          ${RELATED_PRODUCT_ITEM_FRAGMENT}
          query ProductForRelated($handle: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
            product(handle: $handle) { ...RelatedProductItem }
          }
        `;
        const extra = await storefront.query(PRODUCT_BY_HANDLE_FOR_RELATED, {
          variables: {handle: 'waste-basket'},
        });
        const extraProduct = extra?.product;
        if (extraProduct?.id) {
          relatedProducts = [...relatedProducts, extraProduct];
        }
      }
    } catch {
      console.warn(
        'Failed to augment related bathroom products with waste-basket',
      );
    }
  }

  return {product, relatedCollection, relatedProducts};
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
  const {product, relatedCollection, relatedProducts} = useLoaderData();

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
          <ProductGallery
            images={product?.images?.nodes ?? []}
            selectedVariantImage={selectedVariant?.image}
          />
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

      {/* Related products in same category */}
      {relatedCollection && (relatedProducts?.length ?? 0) > 0 && (
        <div className="related-section" style={{marginTop: '5rem'}}>
          <style>
            {`
              .related-section {
                background: #f9f9f9;
                border: 1px solid #eee;
                border-radius: 12px;
                padding: 2rem;
              }
              .related-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 1.25rem;
              }
              .related-eyebrow {
                font-size: 0.75rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #888;
                margin: 0 0 0.35rem 0;
              }
              .related-title {
                font-size: 1.5rem;
                font-weight: 300;
                margin: 0;
                letter-spacing: 0.02em;
              }
              .related-view-all {
                font-size: 0.9rem;
                color: #111;
                text-decoration: none;
                border: 1px solid #ddd;
                padding: 0.45rem 0.8rem;
                border-radius: 999px;
                background: #fff;
                transition: background 0.2s ease, border-color 0.2s ease;
              }
              .related-view-all:hover { background: #f3f3f3; border-color: #ccc; }
              .related-divider { height: 1px; background: #ececec; margin: 1.25rem 0 1.5rem; }
              .products-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1.5rem;
              }
              @media (max-width: 1024px) {
                .products-grid { grid-template-columns: repeat(3, 1fr); }
              }
              @media (max-width: 768px) {
                .products-grid { grid-template-columns: repeat(2, 1fr); }
              }
              @media (max-width: 480px) {
                .products-grid { grid-template-columns: 1fr; }
              }
              .product-item {
                text-decoration: none;
                color: inherit;
                display: block;
                background: #fff;
                border: 1px solid #eee;
                border-radius: 10px;
                overflow: hidden;
                transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
              }
              .product-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 22px rgba(0,0,0,0.06);
                border-color: #e3e3e3;
              }
              .product-image { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #fafafa; }
              .product-image img { transition: transform 0.25s ease; }
              .product-item:hover .product-image img { transform: scale(1.03); }
              .product-info { padding: 0.6rem 0.75rem 0.8rem; }
              .product-info h4 { font-size: 1rem; font-weight: 400; margin: 0.25rem 0; letter-spacing: 0.03em; }
              .product-info small { color: #666; }
            `}
          </style>

          <div className="related-header">
            <div>
              <div className="related-eyebrow">In this collection</div>
              <h3 className="related-title">
                More in {relatedCollection.title}
              </h3>
            </div>
            <Link
              className="related-view-all"
              to={`/collections/${relatedCollection.handle}`}
              prefetch="intent"
            >
              View all
            </Link>
          </div>

          <div className="related-divider" />

          <div className="products-grid">
            {relatedProducts
              .filter((p) => p.handle !== product.handle)
              .slice(0, 12)
              .map((p) => (
                <Link
                  key={p.id}
                  className="product-item"
                  to={`/products/${p.handle}`}
                  prefetch="intent"
                >
                  <div className="product-image">
                    {p.featuredImage && (
                      <Image
                        alt={p.featuredImage.altText || p.title}
                        aspectRatio="1/1"
                        data={p.featuredImage}
                        loading="lazy"
                        sizes="(min-width: 45em) 400px, 100vw"
                      />
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{p.title}</h4>
                    {p.priceRange?.minVariantPrice && (
                      <small>
                        <Money data={p.priceRange.minVariantPrice} />
                      </small>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

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
    images(first: 50) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    collections(first: 20) {
      nodes { id handle title }
    }
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

// Minimal product fields for related items
const RELATED_PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyRelated on MoneyV2 {
    amount
    currencyCode
  }
  fragment RelatedProductItem on Product {
    id
    handle
    title
    featuredImage { id altText url width height }
    priceRange {
      minVariantPrice { ...MoneyRelated }
      maxVariantPrice { ...MoneyRelated }
    }
  }
`;

const RELATED_COLLECTION_PRODUCTS_QUERY = `#graphql
  ${RELATED_PRODUCT_ITEM_FRAGMENT}
  query RelatedCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      handle
      title
      products(first: $first) {
        nodes { ...RelatedProductItem }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
