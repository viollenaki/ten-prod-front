import React from 'react';
import mockOrders from '../../data/mockOrders';
import mockUsers from '../../data/mockUsers';
import styles from './admin.module.scss';
import StatsCards from '../../components/Admin/StatsCards';
import ProductsTable from '../../components/Admin/ProductsTable';
import OrdersTable from '../../components/Admin/OrdersTable';

export default function AdminPage(){
	const totalOrders = mockOrders.length;
	const totalUsers = mockUsers.length;
	const revenue = mockOrders.reduce((s,o)=>s + (o.total||0),0);

	const stats = { ordersToday: totalOrders, couriers: Math.max(1, Math.floor(totalUsers/5)), avgDelivery: 15, avgOrder: Math.round(revenue / Math.max(1,totalOrders)) };

	return (
			<div className={`container ${styles.containerPad}`}>
				<h1>Admin Dashboard</h1>

				<StatsCards stats={stats} />

				<section className={styles.ordersSection}>
					<OrdersTable />
				</section>

				<section style={{ marginTop:20 }}>
					<ProductsTable />
				</section>
			</div>
	);
}
