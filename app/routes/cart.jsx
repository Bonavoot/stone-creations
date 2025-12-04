import {useLoaderData} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';

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
  const {cart, session} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
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

      // User inputted discount code
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];

      // Combine gift card codes already applied on cart
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
  const {cart: cartResult, errors, warnings} = result;

  // Use Hydrogen's cart.setCartId() to get properly formatted headers
  const cartHeaders = cartId ? cart.setCartId(cartId) : new Headers();

  // Also commit our session to be safe
  const sessionCookie = await session.commit();

  // Debug logging
  console.log('[CART] cartId:', cartId);
  console.log('[CART] cartHeaders Set-Cookie:', cartHeaders.get('Set-Cookie'));
  console.log('[CART] sessionCookie:', sessionCookie);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
  }

  const responseBody = JSON.stringify({
    cart: cartResult,
    errors,
    warnings,
    analytics: {
      cartId,
    },
  });

  // Start with cart headers (which should include Set-Cookie from Hydrogen)
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // Add cart's Set-Cookie if present
  const cartCookie = cartHeaders.get('Set-Cookie');
  if (cartCookie) {
    headers.append('Set-Cookie', cartCookie);
  }

  // Also add our session cookie
  if (sessionCookie) {
    headers.append('Set-Cookie', sessionCookie);
  }

  if (typeof redirectTo === 'string') {
    headers.set('Location', redirectTo);
  }

  return new Response(responseBody, {status, headers});
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  /** @type {LoaderReturnData} */
  const cart = useLoaderData();

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
