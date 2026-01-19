import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useFetcher, useRevalidator} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 * }}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  // Use a single fetcher for all cart operations on this line
  // This prevents race conditions between multiple operations
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const previousFetcherState = useRef(fetcher.state);
  const isUpdating = fetcher.state !== 'idle';

  // When fetcher completes (transitions from loading/submitting to idle),
  // trigger a revalidation to get fresh cart data from the server.
  // This is necessary because useFetcher doesn't trigger loader revalidation.
  useEffect(() => {
    const wasActive =
      previousFetcherState.current === 'loading' ||
      previousFetcherState.current === 'submitting';
    const isNowIdle = fetcher.state === 'idle';

    if (wasActive && isNowIdle && fetcher.data) {
      // Fetcher just completed with data, trigger revalidation
      // Small delay to ensure server has processed the mutation
      const timeoutId = setTimeout(() => {
        if (revalidator.state === 'idle') {
          revalidator.revalidate();
        }
      }, 50);
      previousFetcherState.current = fetcher.state;
      return () => clearTimeout(timeoutId);
    }

    previousFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, revalidator]);

  // Check if this line is being removed
  let isRemoving = false;
  if (fetcher.formData) {
    try {
      const formInput = fetcher.formData.get('cartFormInput');
      if (formInput) {
        const parsed = JSON.parse(String(formInput));
        isRemoving = parsed.action === 'LinesRemove';
      }
    } catch {
      // Ignore parse errors
    }
  }

  return (
    <li
      key={id}
      className="cart-line"
      style={{opacity: isRemoving ? 0.5 : 1}}
    >
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div>
        <div>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
          >
            <p>{product.title}</p>
          </Link>
          <ProductPrice price={line?.cost?.totalAmount} />
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                {option.name}: {option.value}
              </li>
            ))}
          </ul>
        </div>
        <CartLineQuantity
          line={line}
          fetcher={fetcher}
          isUpdating={isUpdating}
        />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * Uses a shared fetcher to prevent race conditions.
 * @param {{
 *   line: CartLine;
 *   fetcher: ReturnType<typeof useFetcher>;
 *   isUpdating: boolean;
 * }}
 */
function CartLineQuantity({line, fetcher, isUpdating}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  const handleQuantityChange = (newQuantity) => {
    if (isUpdating) return;
    fetcher.submit(
      {
        cartFormInput: JSON.stringify({
          action: 'LinesUpdate',
          inputs: {lines: [{id: lineId, quantity: newQuantity}]},
        }),
      },
      {method: 'post', action: '/cart'},
    );
  };

  const handleRemove = () => {
    if (isUpdating) return;
    fetcher.submit(
      {
        cartFormInput: JSON.stringify({
          action: 'LinesRemove',
          inputs: {lineIds: [lineId]},
        }),
      },
      {method: 'post', action: '/cart'},
    );
  };

  return (
    <div className="cart-line-quantity">
      <button
        aria-label="Decrease quantity"
        disabled={quantity <= 1 || isUpdating}
        name="decrease-quantity"
        onClick={() => handleQuantityChange(prevQuantity)}
        type="button"
      >
        <span>&#8722;</span>
      </button>
      <small>{quantity}</small>
      <button
        aria-label="Increase quantity"
        name="increase-quantity"
        disabled={isUpdating}
        onClick={() => handleQuantityChange(nextQuantity)}
        type="button"
      >
        <span>&#43;</span>
      </button>
      <button
        disabled={isUpdating}
        onClick={handleRemove}
        type="button"
      >
        {isUpdating ? 'Wait...' : 'Remove'}
      </button>
    </div>
  );
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
