import {
  createHydrogenContext,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * @param {Request} request
 * @param {Env} env
 * @param {ExecutionContext} executionContext
 */
export async function createAppLoadContext(request, env, executionContext) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  // Determine the cookie domain from the request URL
  // This ensures the cart cookie works correctly across www and non-www domains
  // CRITICAL: Without this, navigating between www.domain.com and domain.com
  // will result in different carts being used
  const url = new URL(request.url);
  const isLocalhost =
    url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const cookieDomain = isLocalhost
    ? undefined // Let browser use current domain for localhost
    : url.hostname.startsWith('www.')
      ? url.hostname.slice(4) // Remove 'www.' prefix to set cookie on base domain
      : url.hostname; // Use the hostname as-is

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {language: 'EN', country: 'US'},
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
      queryVariables: {
        numCartLines: 100,
      },
      // Explicitly provide cart ID functions with proper cookie domain
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault({
        // Set cookie on base domain so it works on both www and non-www
        // This fixes cart persistence issues when users navigate between domains
        ...(cookieDomain && {domain: cookieDomain}),
      }),
    },
  });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
  };
}
