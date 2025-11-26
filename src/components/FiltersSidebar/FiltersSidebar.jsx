"use client";

import React from 'react';
import styles from './FiltersSidebar.module.scss';
import { formatSom } from '../../utils/formatCurrency';

// FiltersSidebar - presentational filters + simple UI-only controls
export default function FiltersSidebar({ categories = [], filters, setFilters, resetFilters }) {
  const maxPrice = 500; // UI-only slider max

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <div className={styles.header}>Filters</div>

      <div className={styles.group}>
        <input type="search" placeholder="Search products" value={filters.query} onChange={(e)=>setFilters(f=>({ ...f, query: e.target.value }))} className={styles.search} aria-label="Search products" />
      </div>

      <div className={styles.group}>
        <div className={styles.label}>Category</div>
        <div className={styles.chips} role="list">
          {categories.map(c => (
            <button key={c} className={`${styles.chip} ${c === filters.category ? styles.active : ''}`} onClick={()=>setFilters(f=>({ ...f, category: c }))}>{c}</button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.toggle}><input type="checkbox" checked={filters.farmerOnly} onChange={(e)=>setFilters(f=>({ ...f, farmerOnly: e.target.checked }))} /> Farmer products only</label>
      </div>

      <div className={styles.group}>
        <label className={styles.toggle}><input type="checkbox" checked={filters.favoritesOnly} onChange={(e)=>setFilters(f=>({ ...f, favoritesOnly: e.target.checked }))} /> Show favorites only</label>
      </div>

      <div className={styles.group}>
        <div className={styles.label}>Max price: {formatSom(filters.maxPrice || maxPrice)}</div>
        <input type="range" min="0" max={maxPrice} value={filters.maxPrice || maxPrice} onChange={(e)=>setFilters(f=>({ ...f, maxPrice: Number(e.target.value) }))} />
      </div>

      <div className={styles.actions}>
        <button className={styles.reset} onClick={resetFilters}>Reset filters</button>
      </div>
    </aside>
  );
}
