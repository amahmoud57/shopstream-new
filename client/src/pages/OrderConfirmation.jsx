import React from 'react';

const fmt = (cents) => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function OrderConfirmation({ order, onContinue }) {
  if (!order) return null;

  const { order: o, items } = order;

  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Order Confirmed!</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>Thank you for your purchase</p>

        <div className="confirmation-detail">
          <div className="confirmation-row">
            <span className="confirmation-label">Order Number</span>
            <span className="confirmation-value">#{o.id}</span>
          </div>
          <div className="confirmation-row">
            <span className="confirmation-label">Status</span>
            <span className={`badge badge-${o.status}`}>{o.status}</span>
          </div>
          <div className="confirmation-row">
            <span className="confirmation-label">Subtotal</span>
            <span>{fmt(o.subtotal_cents)}</span>
          </div>
          <div className="confirmation-row">
            <span className="confirmation-label">Tax</span>
            <span>{fmt(o.tax_cents)}</span>
          </div>
          <div className="confirmation-row">
            <span className="confirmation-label">Shipping</span>
            <span>{o.shipping_cents === 0 ? 'Free' : fmt(o.shipping_cents)}</span>
          </div>
          <div className="confirmation-row confirmation-total">
            <span>Total</span>
            <span>{fmt(o.total_cents)}</span>
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '20px 0 12px' }}>Items Ordered</h3>
        <div className="confirmation-items">
          {items.map((item, i) => (
            <div key={i} className="confirmation-item">
              <span>Product #{item.product_id} × {item.quantity}</span>
              <span>{fmt(item.total_cents)}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onContinue}
          style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, marginTop: 24 }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
