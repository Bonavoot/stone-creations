import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {User, ShoppingCart, Search, Menu} from 'lucide-react';
import {HeaderDropdown} from './HeaderDropdown';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {menu} = header;
  return (
    <header className="header">
      <div className="banner">
        <p className="banner-txt">ALL PRODUCTS MADE & SHIPPED IN THE U.S.A</p>
      </div>
      <div className="header-content">
        <NavLink
          prefetch="intent"
          to="/"
          style={({isActive}) => ({
            fontWeight: '400',
            color: isActive ? '#000' : '#333',
          })}
          className="logo"
          end
        >
          <strong>Carved & Co.</strong>
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  // Define dropdown menu items
  const collectionsItems = [
    {
      id: 'kitchen',
      title: 'Kitchen',
      url: '/collections/kitchen',
    },
    {
      id: 'bathroom',
      title: 'Bathroom',
      url: '/collections/bathroom',
    },
    {
      id: 'living',
      title: 'Living Room',
      url: '/collections/living',
    },
    {
      id: 'outdoor',
      title: 'Outdoor',
      url: '/collections/outdoor',
    },
  ];

  const showroomItems = [
    {
      id: 'residential',
      title: 'Residential Projects',
      url: '/showroom/residential',
    },
    {
      id: 'commercial',
      title: 'Commercial Projects',
      url: '/showroom/commercial',
    },
    {
      id: 'featured',
      title: 'Featured Installations',
      url: '/showroom/featured',
    },
  ];

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // Skip the contact menu item as we'll handle it separately
        if (item.id === 'gid://shopify/MenuItem/contact') return null;

        // Handle Collections dropdown
        if (item.title.toLowerCase() === 'collections') {
          return (
            <HeaderDropdown
              key={item.id}
              title={item.title.toUpperCase()}
              items={collectionsItems}
              primaryDomainUrl={primaryDomainUrl}
              publicStoreDomain={publicStoreDomain}
            />
          );
        }

        // Handle Showroom dropdown
        if (item.title.toLowerCase() === 'showroom') {
          return (
            <HeaderDropdown
              key={item.id}
              title={item.title.toUpperCase()}
              items={showroomItems}
              primaryDomainUrl={primaryDomainUrl}
              publicStoreDomain={publicStoreDomain}
            />
          );
        }

        // Handle regular menu items
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title.toUpperCase()}
          </NavLink>
        );
      })}
      {/* Add About Us link */}
      <NavLink
        className="header-menu-item"
        end
        onClick={close}
        prefetch="intent"
        style={activeLinkStyle}
        to="/about"
      >
        ABOUT
      </NavLink>
      {/* Add our custom contact link */}
      <NavLink
        className="header-menu-item"
        end
        onClick={close}
        prefetch="intent"
        style={activeLinkStyle}
        to="/contact"
      >
        CONTACT
      </NavLink>
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <SearchToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback={<User size={20} />}>
          <Await resolve={isLoggedIn} errorElement={<User size={20} />}>
            {(isLoggedIn) => (
              <>
                <span className="sr-only">
                  {isLoggedIn ? <User size={20} /> : <User size={20} />}
                </span>
              </>
            )}
          </Await>
        </Suspense>
      </NavLink>

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <Menu size={24} />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset search-icon" onClick={() => open('search')}>
      <Search size={20} />
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <ShoppingCart className="cart-icon" size={20} />{' '}
      {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/showroom',
      resourceId: null,
      tags: [],
      title: 'Showroom',
      type: 'HTTP',
      url: '/showroom',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/about',
      resourceId: null,
      tags: [],
      title: 'About Us',
      type: 'HTTP',
      url: '/about',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/contact',
      resourceId: null,
      tags: [],
      title: 'Contact',
      type: 'HTTP',
      url: '/contact',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? '600' : '400',
    color: isPending ? '#666' : '#000',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
