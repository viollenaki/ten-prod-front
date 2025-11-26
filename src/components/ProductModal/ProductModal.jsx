"use client";

import React from 'react';
import styles from './ProductModal.module.scss';
import { formatSom } from '../../utils/formatCurrency';

export default function ProductModal({ product, open, onClose, onAdd }) {
  if (!open || !product) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        <div className={styles.content}>
          <div className={styles.photo}>{/* TODO: product image */}Photo</div>
          <div className={styles.info}>
            <h2>{product.name}</h2>
            <div className={styles.meta}>{product.category} · ≈ {product.time} min</div>
            <p className={styles.desc}>{product.description}</p>
            <div className={styles.row}><div className={styles.price}>{formatSom(product.price)} / {product.unit}</div>
              <button className={styles.add} onClick={()=>onAdd({ ...product, qty:1 })}>Add to cart</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
