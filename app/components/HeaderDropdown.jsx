import {useState, useRef, useEffect} from 'react';
import {NavLink} from '@remix-run/react';

/**
 * @param {{
 *   title: string;
 *   items: Array<{
 *     id: string;
 *     title: string;
 *     url: string;
 *     subItems?: Array<{
 *       id: string;
 *       title: string;
 *       url: string;
 *     }>;
 *   }>;
 *   primaryDomainUrl: string;
 *   publicStoreDomain: string;
 * }}
 */
export function HeaderDropdown({
  title,
  items,
  primaryDomainUrl,
  publicStoreDomain,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [productExistsMap, setProductExistsMap] = useState({});
  const hasFetchedRef = useRef(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = (e) => {
    // Get the dropdown element and its position
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const rect = dropdown.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Check if the mouse is outside the dropdown area (including a small buffer)
    const buffer = 10; // pixels of buffer zone
    if (
      mouseX < rect.left - buffer ||
      mouseX > rect.right + buffer ||
      mouseY < rect.top - buffer ||
      mouseY > rect.bottom + buffer
    ) {
      setIsOpen(false);
    }
  };

  const normalizeUrl = (url) => {
    if (!url) return '';
    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  useEffect(() => {
    // Only fetch once to prevent infinite loops
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    // Collect unique product handles from subItems
    const handles = new Set();
    items.forEach((item) => {
      (item.subItems || []).forEach((sub) => {
        const raw = sub?.url || '';
        const idx = raw.indexOf('/products/');
        if (idx !== -1) {
          const after = raw.slice(idx + '/products/'.length);
          const handle = after.split('/')[0];
          if (handle) handles.add(handle);
        }
      });
    });

    if (handles.size === 0) return;

    (async () => {
      const entries = await Promise.all(
        Array.from(handles).map(async (handle) => {
          try {
            const res = await fetch(
              `/api/product-exists?handle=${encodeURIComponent(handle)}`,
            );
            const data = await res.json();
            return [handle, Boolean(data?.exists)];
          } catch {
            return [handle, false];
          }
        }),
      );
      const nextMap = {};
      entries.forEach(([h, ok]) => {
        nextMap[h] = ok;
      });
      setProductExistsMap(nextMap);
    })();
  }, [items]);

  return (
    <div
      className="header-dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        className="header-dropdown-trigger"
        to={
          title.toLowerCase() === 'collections'
            ? '/collections/all'
            : '/gallery'
        }
        style={({isActive}) => ({
          fontWeight: isActive ? '600' : '400',
          color: '#333',
        })}
      >
        {title}
        <span className="header-dropdown-arrow" />
      </NavLink>
      {isOpen && (
        <div
          className="header-dropdown-content"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item) => {
            if (!item.url) return null;

            const itemUrl = normalizeUrl(item.url);

            return (
              <div key={item.id} className="header-dropdown-section">
                <NavLink to={itemUrl} className="header-dropdown-category">
                  {item.title}
                </NavLink>
                {item.subItems && item.subItems.length > 0 && (
                  <div className="header-dropdown-subitems">
                    {item.subItems
                      .filter((subItem) => {
                        const subItemUrl = normalizeUrl(subItem.url);
                        if (!subItemUrl.startsWith('/products/')) return true;
                        const handle = subItemUrl
                          .split('/products/')[1]
                          ?.split('/')[0];
                        if (!handle) return false;
                        const exists = productExistsMap[handle];
                        // Default to showing until we know; remove when confirmed false
                        return exists !== false;
                      })
                      .map((subItem) => {
                        const subItemUrl = normalizeUrl(subItem.url);
                        return (
                          <NavLink
                            key={subItem.id}
                            to={subItemUrl}
                            className="header-dropdown-subitem"
                          >
                            {subItem.title}
                          </NavLink>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
