import {Link, useFetchers, useRevalidator} from '@remix-run/react';
import {createContext, useContext, useId, useRef, useEffect} from 'react';
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
 * Provider component that manages cart state.
 *
 * IMPORTANT: We use useOptimisticCart for optimistic updates, but we also
 * need to manually trigger revalidation after cart mutations complete.
 * This is because CartForm uses useFetcher which doesn't automatically
 * trigger route revalidation, and the optimistic UI can cause components
 * to unmount before the fetcher completes.
 *
 * @param {{cart: CartApiQueryFragment | null, children: React.ReactNode}}
 */
function CartProvider({cart: originalCart, children}) {
  const fetchers = useFetchers();
  const revalidator = useRevalidator();
  const previousFetcherStatesRef = useRef(new Map());

  // Track cart-related fetchers that have completed
  // When a cart fetcher transitions from loading/submitting to idle,
  // we need to revalidate to get fresh cart data
  useEffect(() => {
    const cartFetchers = fetchers.filter((f) => {
      const formInput = f.formData?.get('cartFormInput');
      if (!formInput) return false;
      try {
        const parsed = JSON.parse(String(formInput));
        return ['LinesRemove', 'LinesUpdate', 'LinesAdd'].includes(
          parsed.action,
        );
      } catch {
        return false;
      }
    });

    cartFetchers.forEach((fetcher) => {
      const key = fetcher.key || 'unknown';
      const prevState = previousFetcherStatesRef.current.get(key);
      const currentState = fetcher.state;

      // If fetcher just completed (was loading/submitting, now idle)
      // trigger a revalidation to get fresh cart data
      if (
        (prevState === 'loading' || prevState === 'submitting') &&
        currentState === 'idle'
      ) {
        // Small delay to ensure the mutation has propagated
        setTimeout(() => {
          if (revalidator.state === 'idle') {
            revalidator.revalidate();
          }
        }, 100);
      }

      previousFetcherStatesRef.current.set(key, currentState);
    });

    // Cleanup old entries
    if (previousFetcherStatesRef.current.size > 50) {
      const entries = Array.from(previousFetcherStatesRef.current.entries());
      previousFetcherStatesRef.current = new Map(entries.slice(-25));
    }
  }, [fetchers, revalidator]);

  // Use Hydrogen's optimistic cart hook for immediate UI updates
  const optimisticCart = useOptimisticCart(originalCart);

  return (
    <CartContext.Provider value={optimisticCart}>
      {children}
    </CartContext.Provider>
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
