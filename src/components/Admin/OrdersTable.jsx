"use client";

import React, { useState } from 'react';
import styles from './OrdersTable.module.scss';
import { formatSom } from '../../utils/formatCurrency';
import mockOrders from '../../data/mockOrders';

export default function OrdersTable(){
  const [orders, setOrders] = useState(mockOrders.map(o=>({ ...o, createdAt: o.createdAt || new Date().toISOString() })));

  function changeStatus(id, next){
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: next } : o));
  }

  return (
    <div>
      <h3>Orders</h3>
      {orders.length === 0 ? <div className={styles.empty}>No orders</div> : (
        <table className={styles.table}>
          <thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.address}</td>
                <td>{formatSom ? formatSom(o.total) : o.total + ' сом'}</td>
                <td>{o.status}</td>
                <td>
                  <select value={o.status} onChange={(e)=>changeStatus(o.id, e.target.value)}>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
