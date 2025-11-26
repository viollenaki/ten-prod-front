"use client";

import React, { useState } from 'react';
import styles from './ProductCard.module.scss';
import { formatSom } from '../../utils/formatCurrency';

// ProductCard - compact product card with accessible quantity controls and preview trigger
export default function ProductCard({ product, onAdd, onPreview, isFavorite = false, onToggleFavorite }) {
  const [qty, setQty] = useState(1);

  function dec() {
    setQty(q => Math.max(1, q - 1));
  }
  function inc() {
    setQty(q => q + 1);
  }

  function handleAdd() {
    onAdd({ ...product, qty });
    setQty(1);
  }

  return (
<article className={styles.card} tabIndex={0} aria-labelledby={`p-${product.id}-title`}>
  <div className={styles.cardTop}>
    <button
      className={styles.thumb}
      onClick={() => onPreview(product)}
      aria-label={`Preview ${product.name}`}>
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
        />
      ) : (
        <div className={styles.thumbPlaceholder}>Photo</div>
      )}
    </button>
    <button
      className={`${styles.heart} ${isFavorite ? styles.fav : ''}`}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => onToggleFavorite && onToggleFavorite(product.id)}>
      ♥
    </button>
  </div>

  <div className={styles.rowTop}>
    <h3
      id={`p-${product.id}-title`}
      className={styles.title}
      onClick={() => onPreview(product)}
    >
      {product.name}
    </h3>
    <div className={styles.meta}>{product.category} · ≈ {product.time} min</div>
  </div>

  <div className={styles.rowBot}>
    <div className={styles.priceCol}>
      <div className={styles.small}>{formatSom(product.price)} / {product.unit}</div>
      {product.isFarm && <div className={styles.badge}>Farmer</div>}
    </div>

    <div className={styles.controls}>
      <div className={styles.qty} role="group" aria-label={`Quantity for ${product.name}`}>
        <button className={styles.qtyBtn} onClick={dec} aria-label={`Decrease quantity of ${product.name}`}>−</button>
        <div className={styles.qtyNum}>{qty}</div>
        <button className={styles.qtyBtn} onClick={inc} aria-label={`Increase quantity of ${product.name}`}>+</button>
      </div>
      <button className={`${styles.btn} ${styles.btnAdd}`} onClick={handleAdd} aria-label={`Add ${product.name} to cart`}>Add</button>
    </div>
  </div>
</article>
          {product.isFarm && <div className={styles.badge}>Farmer</div>}
        </div>

        <div className={styles.controls}>
          <div className={styles.qty} role="group" aria-label={`Quantity for ${product.name}`}>
            <button className={styles.qtyBtn} onClick={dec} aria-label={`Decrease quantity of ${product.name}`}>−</button>
            <div className={styles.qtyNum}>{qty}</div>
            <button className={styles.qtyBtn} onClick={inc} aria-label={`Increase quantity of ${product.name}`}>+</button>
          </div>
          <button className={`${styles.btn} ${styles.btnAdd}`} onClick={handleAdd} aria-label={`Add ${product.name} to cart`}>Add</button>
        </div>
      </div>
    </article>
  );
}
