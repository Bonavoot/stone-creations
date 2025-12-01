import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {User, ShoppingCart, Search, Menu} from 'lucide-react';
import {HeaderDropdown} from './HeaderDropdown';
import phLogo from '~/assets/ph-logo.png';
import polishLogo from '~/assets/polish-sample-logo.png';

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
        <NavLink prefetch="intent" to="/" className="logo" end>
          <img
            src={polishLogo}
            alt="Polish Sample Logo"
            style={{height: '70px', width: 'auto', opacity: 1}}
          />
          <img
            src={phLogo}
            alt="Polished and Honed"
            style={{height: '120px', width: 'auto', marginLeft: '-25px'}}
          />
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
      subItems: [
        {
          id: 'cutting-boards',
          title: 'Cutting Boards',
          url: '/products/cutting-board',
        },
        {
          id: 'bowls',
          title: 'Bowls',
          url: '/products/bowl',
        },
      ],
    },
    {
      id: 'bathroom',
      title: 'Bathroom',
      url: '/collections/bathroom',
      subItems: [
        {
          id: 'soap-dishes',
          title: 'Soap Dishes',
          url: '/products/soap-dish',
        },
        {
          id: 'waste-baskets',
          title: 'Waste Baskets',
          url: '/products/waste-basket',
        },
        {
          id: 'marble-toothbrush-holders',
          title: 'Toothbrush Holder',
          url: '/products/marble-toothbrush-holder',
        },
        {
          id: 'countertop-trays',
          title: 'Countertop Tray',
          url: '/products/countertop-tray',
        },
      ],
    },
    {
      id: 'living',
      title: 'Living Room',
      url: '/collections/living',
      subItems: [
        {
          id: 'coffee-tables',
          title: 'Coffee Tables',
          url: '/products/coffee-table',
        },
        {
          id: 'marble-bookends',
          title: 'Bookends',
          url: '/products/marble-bookends',
        },
        {
          id: 'marble-side-tables',
          title: 'Side Table',
          url: '/products/marble-side-table',
        },
      ],
    },
    {
      id: 'outdoor',
      title: 'Outdoor',
      url: '/collections/outdoor',
      subItems: [
        {
          id: 'planters',
          title: 'Planters',
          url: '/products/planter',
        },
        {
          id: 'garden-benches',
          title: 'Garden Bench',
          url: '/products/garden-bench',
        },
        {
          id: 'bird-baths',
          title: 'Bird Bath',
          url: '/products/bird-bath',
        },
      ],
    },
    {
      id: 'barware',
      title: 'Barware',
      url: '/collections/barware',
      subItems: [
        {
          id: 'coasters',
          title: 'Coasters',
          url: '/products/coasters',
        },
        {
          id: 'serving-boards',
          title: 'Serving Board',
          url: '/products/serving-board',
        },
      ],
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

        // Handle Gallery/Showroom as regular menu item (no dropdown)
        if (
          item.title.toLowerCase() === 'gallery' ||
          item.title.toLowerCase() === 'showroom'
        ) {
          return (
            <NavLink
              className="header-menu-item"
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={activeLinkStyle}
              to="/gallery"
            >
              GALLERY
            </NavLink>
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
      id: 'gid://shopify/MenuItem/gallery',
      resourceId: null,
      tags: [],
      title: 'Gallery',
      type: 'HTTP',
      url: '/gallery',
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
