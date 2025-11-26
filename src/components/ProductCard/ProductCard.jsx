import React from 'react';
import styles from './ProductCard.module.scss';

export default function ProductCard({ product, onAdd }) {
  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius: '8px'}} />
        ) : (
          "Image"
        )}
      </div>
      <div>
        <div className={styles.title}>{product.name}</div>
        <div className={styles.meta}>{product.category} · ≈ {product.time} min</div>
      </div>

      <div className={styles.priceRow}>
        <div>
          <div className={styles.small}>${product.price} / {product.unit}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {product.isFarm && <div className={styles.badge}>Farmer</div>}
          <button className={`${styles.btn} ${styles.btnAdd}`} onClick={() => onAdd(product)}>Add</button>
        </div>
      </div>
    </div>
  );
}
