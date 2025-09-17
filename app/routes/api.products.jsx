/**
 * Loader for /api/products
 * Supports cursor-based pagination via ?after=CURSOR
 */

/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const after = url.searchParams.get('after');

  const variables = {
    first: 12,
    after,
  };

  const {products} = await context.storefront.query(PAGINATE_PRODUCTS_QUERY, {
    variables,
  });

  return {products};
}

const PAGINATE_PRODUCTS_QUERY = `#graphql
  fragment ProductCard on Product {
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
  query PaginateProducts(
    $first: Int!
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

