import React from 'react';
import mockOrders from '../../data/mockOrders';

export default function CourierPage() {
  return (
    <div className="container" style={{ padding:24 }}>
      <h1>Courier Dashboard</h1>
      <p>Orders assigned to couriers (mock data).</p>

      <div style={{ display:'grid', gap:12, marginTop:12 }}>
        {mockOrders.map(o => (
          <div key={o.id} style={{ padding:12, borderRadius:10, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:700 }}>{o.id} — {o.customer}</div>
              <div style={{ color:'#6b7280' }}>{o.address}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight:700 }}>{o.total} ₽</div>
              <div style={{ marginTop:8 }}><span style={{ padding:'6px 10px', borderRadius:8, background:'#fff3cd', color:'#92400e' }}>{o.status}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
