/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */

export async function loader({request, context}) {
  const url = new URL(request.url);
  const handle = url.searchParams.get('handle');

  if (!handle) {
    return new Response(JSON.stringify({error: 'Missing handle parameter'}), {
      status: 400,
      headers: {'content-type': 'application/json'},
    });
  }

  const query = `#graphql
    query ProductExists($handle: String!, $country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      product(handle: $handle) { id }
    }
  `;

  let exists = false;
  try {
    const result = await context.storefront.query(query, {
      variables: {handle},
      cache: context.storefront.CacheShort(),
    });
    exists = Boolean(result?.product?.id);
  } catch (e) {
    exists = false;
  }

  return new Response(JSON.stringify({exists}), {
    status: 200,
    headers: {'content-type': 'application/json'},
  });
}
