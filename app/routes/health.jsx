/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({context}) {
  const env = context?.env ?? {};

  const required = [
    'PUBLIC_STORE_DOMAIN',
    'PUBLIC_CHECKOUT_DOMAIN',
    'PUBLIC_STOREFRONT_API_TOKEN',
    'SESSION_SECRET',
  ];

  /** @type {Record<string, boolean>} */
  const presence = Object.fromEntries(
    required.map((key) => [key, Boolean(env[key])]),
  );

  // Optional keys
  presence.PUBLIC_STOREFRONT_ID = Boolean(env.PUBLIC_STOREFRONT_ID);

  const ok = required.every((key) => presence[key]);

  return {
    ok,
    env: presence,
  };
}
