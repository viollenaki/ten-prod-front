"use client";

import React from 'react';
import styles from './FiltersSidebar.module.scss';
import { formatSom } from '../../utils/formatCurrency';

// FiltersSidebar - now horizontal bar
export default function FiltersSidebar({ categories = [], filters, setFilters, resetFilters }) {
  const maxPrice = 500; // UI-only slider max

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <div className={styles.row}>
        {/* Categories */}
        <div className={styles.group}>
          <label className={styles.label}>Category:</label>
          <select 
            className={styles.select} 
            value={filters.category} 
            onChange={(e)=>setFilters(f=>({ ...f, category: e.target.value }))}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Farmer Toggle */}
        <div className={styles.group}>
            <label className={styles.toggle}>
                <input type="checkbox" checked={filters.farmerOnly} onChange={(e)=>setFilters(f=>({ ...f, farmerOnly: e.target.checked }))} /> 
                <span>Farmer products only</span>
            </label>
        </div>

        {/* Price Slider */}
        <div className={styles.group} style={{minWidth: 200}}>
            <label className={styles.label} style={{display:'flex', justifyContent:'space-between'}}>
                <span>Max Price</span>
                <span>{formatSom(filters.maxPrice || maxPrice)}</span>
            </label>
            <input 
                type="range" 
                min="0" 
                max={maxPrice} 
                className={styles.range}
                value={filters.maxPrice || maxPrice} 
                onChange={(e)=>setFilters(f=>({ ...f, maxPrice: Number(e.target.value) }))} 
            />
        </div>

        {/* Reset Button */}
        <button className={styles.reset} onClick={resetFilters}>Reset</button>
      </div>
    </aside>
  );
}
