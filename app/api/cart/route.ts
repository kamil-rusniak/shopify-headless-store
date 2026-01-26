import { NextRequest, NextResponse } from 'next/server';
import {
  getCart,
  createCart,
  addToCart,
  updateCart,
  removeFromCart,
} from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');

  if (!cartId) {
    return NextResponse.json({ error: 'Cart ID is required' }, { status: 400 });
  }

  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cartId, lines, lineIds } = body;

    let cart;

    switch (action) {
      case 'create':
        cart = await createCart(lines);
        break;

      case 'add':
        if (!cartId) {
          cart = await createCart(lines);
        } else {
          cart = await addToCart(cartId, lines);
        }
        break;

      case 'update':
        if (!cartId) {
          return NextResponse.json(
            { error: 'Cart ID is required for update' },
            { status: 400 }
          );
        }
        cart = await updateCart(cartId, lines);
        break;

      case 'remove':
        if (!cartId || !lineIds) {
          return NextResponse.json(
            { error: 'Cart ID and line IDs are required for remove' },
            { status: 400 }
          );
        }
        cart = await removeFromCart(cartId, lineIds);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cart operation failed' },
      { status: 500 }
    );
  }
}
