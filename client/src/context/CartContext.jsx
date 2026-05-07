import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'shopstream_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let next;
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.product_id === action.item.product_id);
      if (existing) {
        next = state.map((i) =>
          i.product_id === action.item.product_id
            ? { ...i, quantity: Math.min(i.quantity + 1, i.stock_qty) }
            : i
        );
      } else {
        next = [...state, { ...action.item, quantity: 1 }];
      }
      break;
    }
    case 'REMOVE_ITEM':
      next = state.filter((i) => i.product_id !== action.product_id);
      break;
    case 'UPDATE_QUANTITY':
      next = state.map((i) =>
        i.product_id === action.product_id
          ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.stock_qty)) }
          : i
      );
      break;
    case 'CLEAR':
      next = [];
      break;
    default:
      return state;
  }
  saveCart(next);
  return next;
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        dispatch({ type: 'CLEAR' }); // reset then reload
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addToCart = (product) =>
    dispatch({
      type: 'ADD_ITEM',
      item: {
        product_id: product.id,
        name: product.name,
        price_cents: product.price_cents,
        vendor_name: product.vendor_name,
        stock_qty: product.stock_qty,
        category_icon: product.category_icon || '📦',
      },
    });

  const removeFromCart = (product_id) => dispatch({ type: 'REMOVE_ITEM', product_id });
  const updateQuantity = (product_id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', product_id, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.08);
  const cartShipping = cartSubtotal > 5000 ? 0 : 599;
  const cartTotal = cartSubtotal + cartTax + cartShipping;

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartSubtotal, cartTax, cartShipping, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
