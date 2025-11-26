"use client";

import React from 'react';
import styles from './StatsCards.module.scss';

export default function StatsCards({ stats = {} }) {
  return (
    <div className={styles.row}>
      <div className={styles.card}><div className={styles.label}>Orders today</div><div className={styles.value}>{stats.ordersToday ?? 0}</div></div>
      <div className={styles.card}><div className={styles.label}>Active couriers</div><div className={styles.value}>{stats.couriers ?? 0}</div></div>
      <div className={styles.card}><div className={styles.label}>Avg delivery (min)</div><div className={styles.value}>{stats.avgDelivery ?? '—'}</div></div>
      <div className={styles.card}><div className={styles.label}>Avg order value</div><div className={styles.value}>{stats.avgOrder ?? '—'}</div></div>
    </div>
  );
}
