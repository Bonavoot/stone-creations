import {Link, useFetchers} from '@remix-run/react';
import {createContext, useContext, useId, useRef} from 'react';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

/**
 * Cart context for sharing the most up-to-date cart state across the app.
 * This is necessary because:
 * 1. CartForm uses useFetcher() which doesn't trigger route revalidation
 * 2. useOptimisticCart only works during pending state
 * 3. When an item is removed optimistically, the CartLineItem unmounts,
 *    killing the fetcher before we can capture its result
 * 4. We need to track pending removals and filter them out manually
 */
const CartContext = createContext(null);

/**
 * Hook to get the current cart state from context
 * @returns {CartApiQueryFragment | null}
 */
export function useCartState() {
  return useContext(CartContext);
}

/**
 * Provider component that manages cart state by:
 * 1. Taking the original cart from root loader
 * 2. Tracking pending removals (line IDs being removed)
 * 3. Filtering out removed lines manually since useOptimisticCart
 *    causes unmounts that kill fetchers
 * 4. Syncing with loader data when it updates
 *
 * @param {{cart: CartApiQueryFragment | null, children: React.ReactNode}}
 */
function CartProvider({cart: originalCart, children}) {
  const fetchers = useFetchers();

  // Track the previous cart ID to detect when loader refreshes
  const prevCartIdRef = useRef(originalCart?.id);
  // Track line IDs that are being removed
  const pendingRemovalsRef = useRef(new Set());

  // Find all PENDING removal fetchers (submitting or loading)
  const pendingRemovalFetchers = fetchers.filter(
    (f) =>
      (f.state === 'submitting' || f.state === 'loading') &&
      f.formData?.get('cartFormInput'),
  );

  // Track new pending removals
  pendingRemovalFetchers.forEach((fetcher) => {
    try {
      const formInput = fetcher.formData?.get('cartFormInput');
      if (formInput) {
        const parsed = JSON.parse(formInput);
        if (parsed.action === 'LinesRemove' && parsed.inputs?.lineIds) {
          parsed.inputs.lineIds.forEach((id) => {
            pendingRemovalsRef.current.add(id);
          });
        }
      }
    } catch {
      // Ignore parse errors
    }
  });

  // If the cart ID changed (loader refresh), clear pending removals
  // This means the server has given us fresh data
  if (originalCart?.id !== prevCartIdRef.current) {
    pendingRemovalsRef.current.clear();
    prevCartIdRef.current = originalCart?.id;
  }

  // Also clear pending removals if they're no longer in the cart
  // (meaning the server has processed them)
  if (originalCart?.lines?.nodes && pendingRemovalsRef.current.size > 0) {
    const currentLineIds = new Set(originalCart.lines.nodes.map((n) => n.id));
    pendingRemovalsRef.current.forEach((removedId) => {
      if (!currentLineIds.has(removedId)) {
        pendingRemovalsRef.current.delete(removedId);
      }
    });
  }

  // Create an optimistic cart by filtering out pending removals
  let optimisticCart = originalCart;
  if (originalCart && pendingRemovalsRef.current.size > 0) {
    const filteredLines = originalCart.lines?.nodes?.filter(
      (line) => !pendingRemovalsRef.current.has(line.id),
    );
    const totalQuantity = filteredLines?.reduce(
      (sum, line) => sum + line.quantity,
      0,
    );
    optimisticCart = {
      ...originalCart,
      lines: {
        ...originalCart.lines,
        nodes: filteredLines || [],
      },
      totalQuantity: totalQuantity ?? 0,
    };
  }

  // Also apply useOptimisticCart for other mutations (add, update quantity)
  const finalCart = useOptimisticCart(optimisticCart);

  return (
    <CartContext.Provider value={finalCart}>{children}</CartContext.Provider>
  );
}

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  return (
    <CartProvider cart={cart}>
      <Aside.Provider>
        <CartAside />
        <SearchAside />
        <MobileMenuAside
          header={header}
          publicStoreDomain={publicStoreDomain}
        />
        {header && (
          <Header
            header={header}
            isLoggedIn={isLoggedIn}
            publicStoreDomain={publicStoreDomain}
          />
        )}
        <main>{children}</main>
        <Footer
          footer={footer}
          header={header}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside.Provider>
    </CartProvider>
  );
}

/**
 * Cart aside component - uses cart from context
 */
function CartAside() {
  const cart = useCartState();
  return (
    <Aside type="cart" heading="CART">
      <CartMain cart={cart} layout="aside" />
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   header: PageLayoutProps['header'];
 *   publicStoreDomain: PageLayoutProps['publicStoreDomain'];
 * }}
 */
function MobileMenuAside({header, publicStoreDomain}) {
  const hasMenu = !!header?.menu;
  const primaryDomainUrl = header?.shop?.primaryDomain?.url;

  if (!hasMenu || !primaryDomainUrl) return null;

  return (
    <Aside type="mobile" heading="MENU">
      <HeaderMenu
        menu={header.menu}
        viewport="mobile"
        primaryDomainUrl={primaryDomainUrl}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside>
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {CartApiQueryFragment|null} cart
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
