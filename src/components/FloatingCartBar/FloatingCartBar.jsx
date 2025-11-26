"use client";

import React from 'react';
import styles from './FloatingCartBar.module.scss';
import { useRouter } from 'next/navigation';
import { formatSom } from '../../utils/formatCurrency';

export default function FloatingCartBar({ itemsCount = 0, total = 0, onCheckout }) {
  const router = useRouter();
  if (!itemsCount || itemsCount === 0) return null;

  return (
    <div className={styles.bar} role="region" aria-label="Cart summary">
      <div className={styles.container}>
        <div className={styles.summary}>{itemsCount} item{itemsCount>1? 's':''} · {formatSom(total)}</div>
        <button className={styles.button} onClick={() => onCheckout ? onCheckout() : router.push('/store/checkout')}>Proceed to payment</button>
      </div>
    </div>
  );
}
