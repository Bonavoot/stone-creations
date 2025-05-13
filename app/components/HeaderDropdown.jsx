import {useState, useRef} from 'react';
import {NavLink} from '@remix-run/react';

/**
 * @param {{
 *   title: string;
 *   items: Array<{
 *     id: string;
 *     title: string;
 *     url: string;
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
            : '/showroom'
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
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            return (
              <NavLink key={item.id} to={url} className="header-dropdown-item">
                {item.title}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
