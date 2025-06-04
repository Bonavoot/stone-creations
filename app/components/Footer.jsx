import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {Facebook, Instagram, Twitter} from 'lucide-react';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-section">
                <h3>About Us</h3>
                <p>
                  Luxury marble products crafted with precision and passion for
                  discerning spaces.
                </p>
                <div className="social-links">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter size={20} />
                  </a>
                </div>
              </div>

              <div className="footer-section">
                <h3>Quick Links</h3>
                <nav className="footer-menu" role="navigation">
                  {(footer?.menu || FALLBACK_FOOTER_MENU).items.map((item) => {
                    if (!item.url) return null;
                    const url =
                      item.url.includes('myshopify.com') ||
                      item.url.includes(publicStoreDomain) ||
                      item.url.includes(header.shop.primaryDomain.url)
                        ? new URL(item.url).pathname
                        : item.url;
                    const isExternal = !url.startsWith('/');
                    return isExternal ? (
                      <a
                        href={url}
                        key={item.id}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <NavLink
                        end
                        key={item.id}
                        prefetch="intent"
                        style={activeLinkStyle}
                        to={url}
                      >
                        {item.title}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="footer-section">
                <h3>Contact Us</h3>
                <p>Email: info@carveandco.com</p>
                <p>Phone: (631) 467-1011</p>
                <p>
                  Address: 11 Old Dock Road
                  <br />
                  Yaphank, NY 11980
                </p>
              </div>

              <div className="footer-section">
                <h3>Newsletter</h3>
                <p>
                  Subscribe to receive updates on new collections and exclusive
                  offers.
                </p>
                <form className="newsletter-form">
                  <input type="email" placeholder="Enter your email" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
            <div className="footer-bottom">
              <p>
                &copy; {new Date().getFullYear()} Stone Creations. All rights
                reserved.
              </p>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
