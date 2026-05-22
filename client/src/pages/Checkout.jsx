import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkout } from '../api';

const fmt = (cents) => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Checkout({ onConfirm, onBack }) {
  const { cart, cartSubtotal, cartTax, cartShipping, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', state: '', zip: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const valid = form.name && form.email && form.address && form.city && form.state && form.zip && cart.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await checkout(cart);
      if (result.error) throw new Error(result.error);
      clearCart();
      onConfirm(result);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  if (cart.length === 0 && !submitting) {
    return (
      <div className="loading-screen">
        <div style={{ fontSize: 48 }}>🛒</div>
        <div>Your cart is empty</div>
        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 12 }}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      <div className="checkout-form-section">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <h3 className="checkout-section-title">Shipping Information</h3>
          <div className="checkout-field">
            <label>Full Name</label>
            <input type="text" value={form.name} onChange={update('name')} placeholder="Jane Doe" required />
          </div>
          <div className="checkout-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="jane@example.com" required />
          </div>
          <div className="checkout-field">
            <label>Address</label>
            <input type="text" value={form.address} onChange={update('address')} placeholder="123 Main Street" required />
          </div>
          <div className="checkout-row">
            <div className="checkout-field">
              <label>City</label>
              <input type="text" value={form.city} onChange={update('city')} placeholder="Anytown" required />
            </div>
            <div className="checkout-field" style={{ maxWidth: 100 }}>
              <label>State</label>
              <input type="text" value={form.state} onChange={update('state')} placeholder="CA" maxLength={2} required />
            </div>
            <div className="checkout-field" style={{ maxWidth: 120 }}>
              <label>Zip Code</label>
              <input type="text" value={form.zip} onChange={update('zip')} placeholder="12345" required />
            </div>
          </div>

          <h3 className="checkout-section-title" style={{ marginTop: 24 }}>Payment</h3>
          <div className="checkout-payment-placeholder">
            <span>💳</span>
            <span>Demo mode — no real payment required</span>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={!valid || submitting}
            style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, marginTop: 20 }}>
            {submitting ? 'Placing Order…' : `Place Order — ${fmt(cartTotal)}`}
          </button>
        </form>
      </div>

      <div className="checkout-summary-section">
        <div className="card">
          <div className="card-header"><h3>Order Summary ({cart.length} items)</h3></div>
          <div className="card-body">
            {cart.map((item) => (
              <div key={item.product_id} className="checkout-summary-item">
                <span className="checkout-summary-item-name">{item.name} × {item.quantity}</span>
                <span>{fmt(item.price_cents * item.quantity)}</span>
              </div>
            ))}
            <div className="cart-summary" style={{ marginTop: 12 }}>
              <div className="cart-summary-row"><span>Subtotal</span><span>{fmt(cartSubtotal)}</span></div>
              <div className="cart-summary-row"><span>Tax (8%)</span><span>{fmt(cartTax)}</span></div>
              <div className="cart-summary-row"><span>Shipping</span><span>{cartShipping === 0 ? 'Free' : fmt(cartShipping)}</span></div>
              <div className="cart-summary-row cart-summary-total"><span>Total</span><span>{fmt(cartTotal)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
