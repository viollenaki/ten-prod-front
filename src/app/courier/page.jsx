"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';

export default function CourierPage() {
  const router = useRouter();
  const [available, setAvailable] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
        router.push('/auth');
        return;
    }

    fetchData();
  }, [router]);

  async function fetchData() {
      try {
          const [avail, my] = await Promise.all([
              api.get('/courier/orders/available'),
              api.get('/courier/orders/my')
          ]);
          setAvailable(avail);
          setMyOrders(my);
      } catch (e) {
          console.error(e);
          if (e.message.includes('403')) {
              alert("Access denied. Courier only.");
              router.push('/store');
          }
      } finally {
          setLoading(false);
      }
  }

  async function acceptOrder(id) {
      try {
          await api.post(`/courier/orders/${id}/accept`);
          fetchData(); // Refresh
      } catch (e) {
          console.error(e);
          alert("Failed to accept order");
      }
  }

  async function updateStatus(id, status) {
      try {
          // Backend expects status as a query parameter
          await api.request(`/courier/orders/${id}/status?status=${status}`, { method: 'PUT' });
          fetchData();
      } catch (e) {
          console.error(e);
      }
  }

  if (loading) return <div className="container" style={{padding:40}}>Loading courier dashboard...</div>;

  return (
    <div className={`container ${styles.wrap}`}>
      <h1>Courier Dashboard</h1>
      <button onClick={fetchData} className="btn btn-ghost" style={{marginBottom:12}}>Refresh</button>

      <div style={{display:'grid', gap:24, gridTemplateColumns: '1fr 1fr'}}>
        <section>
            <h2>Available Orders</h2>
            {available.length === 0 && <p style={{color:'#666'}}>No new orders.</p>}
            <div style={{ display:'grid', gap:12, marginTop:12 }}>
                {available.map(o => (
                <div key={o.id} style={{ padding:12, borderRadius:10, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)' }}>
                    <div style={{ fontWeight:700 }}>#{o.id}</div>
                    <div style={{ color:'#6b7280' }}>{o.address}</div>
                    <div style={{ marginTop:8, fontWeight:700 }}>${o.total_price}</div>
                    <button onClick={() => acceptOrder(o.id)} className="btn btn-primary" style={{marginTop:8, width:'100%'}}>Accept</button>
                </div>
                ))}
            </div>
        </section>

        <section>
            <h2>My Active Deliveries</h2>
            {myOrders.length === 0 && <p style={{color:'#666'}}>No active deliveries.</p>}
            <div style={{ display:'grid', gap:12, marginTop:12 }}>
                {myOrders.map(o => (
                <div key={o.id} style={{ padding:12, borderRadius:10, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)' }}>
                    <div style={{ fontWeight:700 }}>#{o.id}</div>
                    <div style={{ color:'#6b7280' }}>{o.address}</div>
                    <div style={{ marginTop:4, fontSize:'0.9em' }}>Status: <strong>{o.status}</strong></div>
                    
                    <div style={{ marginTop:12, display:'flex', gap:4, flexWrap:'wrap' }}>
                        {o.status === 'accepted' && <button onClick={()=>updateStatus(o.id, 'preparing')} className="btn btn-ghost" style={{fontSize:'0.8rem'}}>Preparing</button>}
                        {['accepted', 'preparing'].includes(o.status) && <button onClick={()=>updateStatus(o.id, 'on_the_way')} className="btn btn-ghost" style={{fontSize:'0.8rem'}}>On Way</button>}
                        {o.status === 'on_the_way' && <button onClick={()=>updateStatus(o.id, 'delivered')} className="btn btn-primary" style={{fontSize:'0.8rem'}}>Delivered</button>}
                    </div>
                </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
