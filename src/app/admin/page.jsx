"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';

export default function AdminPage(){
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
            const data = await api.get('/admin/orders');
            setOrders(data);
        } catch (e) {
            console.error(e);
            if (e.message.includes('403')) {
                alert("Access denied. Admin only.");
                router.push('/store');
            }
        } finally {
            setLoading(false);
        }
    }

	const totalOrders = orders.length;
	const revenue = orders.reduce((s,o)=>s + (o.total_price||0),0);

    if (loading) return <div className="container" style={{padding:40}}>Loading admin...</div>;

	return (
		<div className="container" style={{ padding:24 }}>
			<h1>Admin Dashboard</h1>
			<div style={{ display:'flex', gap:12, marginTop:12 }}>
				<div style={{ flex:1, padding:16, borderRadius:12, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)' }}>
					<div style={{ color:'#6b7280' }}>Total Orders</div>
					<div style={{ fontSize:24, fontWeight:800 }}>{totalOrders}</div>
				</div>
				<div style={{ flex:1, padding:16, borderRadius:12, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)' }}>
					<div style={{ color:'#6b7280' }}>Revenue</div>
					<div style={{ fontSize:24, fontWeight:800 }}>${revenue}</div>
				</div>
			</div>

			<section style={{ marginTop:18 }}>
				<h2>Recent Orders</h2>
				<div style={{ marginTop:8 }}>
					<table style={{ width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:8, overflow:'hidden' }}>
						<thead style={{ background:'#f8fafc' }}>
							<tr>
								<th style={{ textAlign:'left', padding:12 }}>Order</th>
								<th style={{ textAlign:'left', padding:12 }}>Total</th>
								<th style={{ textAlign:'left', padding:12 }}>Status</th>
                                <th style={{ textAlign:'left', padding:12 }}>Date</th>
							</tr>
						</thead>
						<tbody>
							{orders.map(o => (
								<tr key={o.id}>
									<td style={{ padding:12 }}>#{o.id}</td>
									<td style={{ padding:12 }}>${o.total_price}</td>
									<td style={{ padding:12 }}>
                                        <span style={{
                                            padding:'4px 8px', borderRadius:12, fontSize:'0.85em',
                                            background: o.status === 'delivered' ? '#dcfce7' : '#fef9c3',
                                            color: o.status === 'delivered' ? '#166534' : '#854d0e'
                                        }}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td style={{ padding:12 }}>{new Date(o.created_at).toLocaleDateString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
