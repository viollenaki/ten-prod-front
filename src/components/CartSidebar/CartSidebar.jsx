"use client";

import React, { useEffect, useRef } from 'react';
import styles from './CartSidebar.module.scss';
import { formatSom } from '../../utils/formatCurrency';

export default function CartSidebar({ cart = [], onChangeQty, onRemove, onCheckout, openMobile, onCloseMobile, onClear }) {
  const elRef = useRef();

  // simple focus management for mobile drawer
  useEffect(()=>{ if (openMobile && elRef.current) elRef.current.focus(); }, [openMobile]);

  const subtotal = cart.reduce((s,i)=>s + (i.price||0) * (i.qty||1), 0);

  return (
    <aside className={`${styles.cart} ${openMobile ? styles.open : ''}`} ref={elRef} tabIndex={-1} aria-label="Cart sidebar">
      <div className={styles.header}>
        <h3>Cart</h3>
        <button className={styles.close} onClick={onCloseMobile} aria-label="Close cart">✕</button>
      </div>

      <div className={styles.body}>
        {cart.length === 0 && <div className={styles.empty}>Your cart is empty</div>}
        {cart.map(item => (
          <div key={item.id} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.meta}>{formatSom(item.price)} × {item.qty}</div>
            </div>
            <div className={styles.actions}>
              <button onClick={()=>onChangeQty(item.id, -1)} aria-label={`Decrease ${item.name}`}>−</button>
              <div className={styles.count}>{item.qty}</div>
              <button onClick={()=>onChangeQty(item.id, 1)} aria-label={`Increase ${item.name}`}>+</button>
              <button className={styles.remove} onClick={()=>onRemove(item.id)} aria-label={`Remove ${item.name}`}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.totals}><div>Subtotal</div><div className={styles.amount}>{formatSom(subtotal)}</div></div>
        <div className={styles.footerBtns}>
          <button className={styles.clear} onClick={()=>{ if (window.confirm('Clear cart?')) onClear && onClear(); }} disabled={cart.length===0}>Clear cart</button>
          <button className={styles.checkoutBtn} onClick={onCheckout} disabled={cart.length===0}>Proceed to payment</button>
        </div>
      </div>
    </aside>
  );
}
