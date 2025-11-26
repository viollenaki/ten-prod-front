import React from 'react';
import mockOrders from '../../data/mockOrders';
import styles from './courier.module.scss';
import { formatSom } from '../../utils/formatCurrency';

export default function CourierPage() {
  return (
    <div className={`container ${styles.wrap}`}>
      <h1>Courier Dashboard</h1>
      <p>Orders assigned to couriers (mock data).</p>

      <div className={styles.gridList}>
        {mockOrders.map(o => (
          <div key={o.id} className={styles.orderCard}>
            <div>
              <div className={styles.orderTitle}>{o.id} — {o.customer}</div>
              <div className={styles.orderAddr}>{o.address}</div>
            </div>
            <div className={styles.orderMeta}>
              <div className={styles.orderMetaAmount}>{formatSom(o.total)}</div>
              <div className={styles.orderMetaBadge}><span className={styles.statusBadge}>{o.status}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
