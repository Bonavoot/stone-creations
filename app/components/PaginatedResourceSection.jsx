import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
 */
export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  const sentinelRef = React.useRef(null);
  const nextLinkContainerRef = React.useRef(null);
  const isLoadingRef = React.useRef(false);

  React.useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;

        // Avoid spamming requests while a page is loading
        if (isLoadingRef.current) return;

        // Find the underlying anchor rendered by NextLink and click it
        const container = nextLinkContainerRef.current;
        const nextAnchor = container?.querySelector('a');
        if (nextAnchor) {
          nextAnchor.click();
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0,
      },
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect();
  }, []);

  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        isLoadingRef.current = isLoading;

        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            {/* Sentinel to trigger auto-loading when nearing the bottom */}
            <div ref={sentinelRef} style={{height: 1}} />
            {/* Keep NextLink in the DOM for progressive enhancement, but hide it visually */}
            <div ref={nextLinkContainerRef} style={{display: 'none'}}>
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
