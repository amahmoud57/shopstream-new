import React from 'react';
import { useCart } from '../context/CartContext';

const fmt = (cents) => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CartSidebar({ open, onClose, onCheckout }) {
  const { cart, removeFromCart, updateQuantity, cartCount, cartSubtotal, cartTax, cartShipping, cartTotal } = useCart();

  return (
    <>
      <div className={`panel-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`panel${open ? ' open' : ''}`}>
        <button className="panel-close" onClick={onClose}>✕</button>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Shopping Cart ({cartCount})</h2>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <div style={{ fontWeight: 500 }}>Your cart is empty</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Add products to get started</div>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-vendor">{item.vendor_name}</div>
                    <div className="cart-item-price">{fmt(item.price_cents)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock_qty}>+</button>
                    </div>
                    <div className="cart-item-line-total">{fmt(item.price_cents * item.quantity)}</div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.product_id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row"><span>Subtotal</span><span>{fmt(cartSubtotal)}</span></div>
              <div className="cart-summary-row"><span>Tax (8%)</span><span>{fmt(cartTax)}</span></div>
              <div className="cart-summary-row"><span>Shipping</span><span>{cartShipping === 0 ? 'Free' : fmt(cartShipping)}</span></div>
              <div className="cart-summary-row cart-summary-total"><span>Total</span><span>{fmt(cartTotal)}</span></div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, marginTop: 16 }} onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </>
  );
}
