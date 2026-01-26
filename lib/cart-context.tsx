'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useTransition,
} from 'react';
import { ShopifyCart } from './shopify/types';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  isUpdating: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  isCartOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (cartId) {
        try {
          const response = await fetch(`/api/cart?cartId=${cartId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.cart) {
              setCart(data.cart);
            } else {
              // Cart not found, remove from storage
              localStorage.removeItem(CART_ID_KEY);
            }
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          localStorage.removeItem(CART_ID_KEY);
        }
      }
      setIsLoading(false);
    };

    loadCart();
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      startTransition(async () => {
        try {
          const cartId = localStorage.getItem(CART_ID_KEY);
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: cartId ? 'add' : 'create',
              cartId,
              lines: [{ merchandiseId: variantId, quantity }],
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to add item to cart');
          }

          const data = await response.json();
          setCart(data.cart);
          localStorage.setItem(CART_ID_KEY, data.cart.id);
          setIsCartOpen(true);
        } catch (error) {
          console.error('Error adding item to cart:', error);
          throw error;
        }
      });
    },
    []
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;

      startTransition(async () => {
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update',
              cartId: cart.id,
              lines: [{ id: lineId, quantity }],
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update cart');
          }

          const data = await response.json();
          setCart(data.cart);
        } catch (error) {
          console.error('Error updating cart:', error);
          throw error;
        }
      });
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;

      startTransition(async () => {
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'remove',
              cartId: cart.id,
              lineIds: [lineId],
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to remove item from cart');
          }

          const data = await response.json();
          setCart(data.cart);
        } catch (error) {
          console.error('Error removing item from cart:', error);
          throw error;
        }
      });
    },
    [cart]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isUpdating: isPending,
        addItem,
        updateItem,
        removeItem,
        openCart,
        closeCart,
        isCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
