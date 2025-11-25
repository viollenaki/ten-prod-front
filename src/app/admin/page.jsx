import React from 'react';
import mockOrders from '../../data/mockOrders';
import mockUsers from '../../data/mockUsers';

export default function AdminPage(){
	const totalOrders = mockOrders.length;
	const totalUsers = mockUsers.length;
	const revenue = mockOrders.reduce((s,o)=>s + (o.total||0),0);

	return (
		<div className="container" style={{ padding:24 }}>
			<h1>Admin Dashboard</h1>
			<div style={{ display:'flex', gap:12, marginTop:12 }}>
				<div style={{ flex:1, padding:16, borderRadius:12, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)' }}>
					<div style={{ color:'#6b7280' }}>Total Orders</div>
					<div style={{ fontSize:24, fontWeight:800 }}>{totalOrders}</div>
				</div>
				<div style={{ flex:1, padding:16, borderRadius:12, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)' }}>
					<div style={{ color:'#6b7280' }}>Total Users</div>
					<div style={{ fontSize:24, fontWeight:800 }}>{totalUsers}</div>
				</div>
				<div style={{ flex:1, padding:16, borderRadius:12, background:'#fff', boxShadow:'0 6px 18px rgba(16,24,40,0.04)' }}>
					<div style={{ color:'#6b7280' }}>Revenue</div>
					<div style={{ fontSize:24, fontWeight:800 }}>{revenue} ₽</div>
				</div>
			</div>

			<section style={{ marginTop:18 }}>
				<h2>Orders</h2>
				<div style={{ marginTop:8 }}>
					<table style={{ width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:8, overflow:'hidden' }}>
						<thead style={{ background:'#f8fafc' }}>
							<tr>
								<th style={{ textAlign:'left', padding:12 }}>Order</th>
								<th style={{ textAlign:'left', padding:12 }}>Customer</th>
								<th style={{ textAlign:'left', padding:12 }}>Total</th>
								<th style={{ textAlign:'left', padding:12 }}>Status</th>
							</tr>
						</thead>
						<tbody>
							{mockOrders.map(o => (
								<tr key={o.id}>
									<td style={{ padding:12 }}>{o.id}</td>
									<td style={{ padding:12 }}>{o.customer}</td>
									<td style={{ padding:12 }}>{o.total} ₽</td>
									<td style={{ padding:12 }}>{o.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
