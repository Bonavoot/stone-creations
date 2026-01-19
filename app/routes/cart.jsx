import {json} from '@shopify/remix-oxygen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {useCartState} from '~/components/PageLayout';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Cart`}];
};

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];
      giftCardCodes.push(...inputs.giftCardCodes);
      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(cartId) : new Headers();

  const {cart: cartResult, errors, warnings} = result || {};

  // Ensure cart responses are not cached by CDN
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  headers.set('Vary', 'Cookie');

  return json(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {headers},
  );
}

/**
 * Pass through headers from cart loaders and actions to prevent CDN caching.
 * This ensures both GET (loader) and POST (action) responses have no-cache headers.
 */
export const headers = ({loaderHeaders, actionHeaders}) => {
  // Use action headers if available (for POST requests), otherwise loader headers
  const sourceHeaders = actionHeaders || loaderHeaders;
  const responseHeaders = new Headers(sourceHeaders);
  responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  responseHeaders.set('Vary', 'Cookie');
  return responseHeaders;
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {cart} = context;
  const cartData = await cart.get();

  // Return cart data with no-cache headers to prevent CDN caching
  return json(cartData, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Vary': 'Cookie',
    },
  });
}

export default function Cart() {
  // Get cart from context for consistent state across cart aside and page
  const cart = useCartState();

  return (
    <div className="cart">
      <h1>Cart</h1>
      <CartMain layout="page" cart={cart} />
    </div>
  );
}

/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
