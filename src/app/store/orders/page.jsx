"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../utils/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      router.push('/auth');
      return;
    }
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const data = await api.get('/orders/');
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="container" style={{ padding: '40px 24px' }}>Loading orders...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div style={{ color: '#666', marginTop: 24 }}>
          <p>You haven't placed any orders yet.</p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: 12 }}
            onClick={() => router.push('/store')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24, marginTop: 24 }}>
          {orders.map(order => (
            <div key={order.id} style={{ 
              border: '1px solid #eee', 
              borderRadius: 12, 
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{order.id}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: getStatusColor(order.status),
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}>
                    {order.status.replace('_', ' ')}
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 4, fontSize: '1.1rem' }}>
                    ${order.total_price}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>Items</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span>{item.product.name} <span style={{color:'#999'}}>x{item.quantity}</span></span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6', fontSize: '0.9rem', color: '#666' }}>
                <div><strong>Delivery Address:</strong> {order.address}</div>
                <div><strong>Payment Method:</strong> {order.payment_method}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'created': return '#9ca3af';
    case 'accepted': return '#3b82f6';
    case 'preparing': return '#8b5cf6';
    case 'on_the_way': return '#f59e0b';
    case 'delivered': return '#10b981';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
}

