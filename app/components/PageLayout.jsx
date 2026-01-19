import {Link} from '@remix-run/react';
import {createContext, useContext, useId} from 'react';
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
 * Simple cart provider that uses Hydrogen's useOptimisticCart.
 * Note: We intentionally do NOT apply optimistic updates here because
 * they can cause issues with component unmounting during removals.
 * Instead, each cart action component handles its own loading state.
 *
 * @param {{cart: CartApiQueryFragment | null, children: React.ReactNode}}
 */
function CartProvider({cart: originalCart, children}) {
  // Just pass through the cart from the loader without optimistic updates
  // This ensures the cart state is always from the server
  return (
    <CartContext.Provider value={originalCart}>
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
