"use client";

import { useMemo, useState, useEffect } from 'react';
import products from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './page.module.scss';

export default function StorePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [farmerOnly, setFarmerOnly] = useState(false);
  const [under100, setUnder100] = useState(false);

  const [cart, setCart] = useState([]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], []);

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }

  function removeItem(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  // persist cart to localStorage
  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  // load cart from localStorage on mount (guarded in useEffect so it's SSR-safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) setCart(JSON.parse(raw));
    } catch {
      setCart([]);
    }
  }, []);

  const filtered = products.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (farmerOnly && !p.isFarm) return false;
    if (under100 && p.price > 100) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = cart.length ? 79 : 0;

  return (
    <div className={styles.storePage}>
      <div className={styles.layout + ' container'}>
        <aside className={styles.filters}>
          <div className={styles['filter-group']}>
            <input className={styles.search} placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className={styles['filter-group']}>
            <div className={styles.categories}>
              {categories.map(c => (
                <div key={c} className={`${styles.category} ${c === category ? styles.active : ''}`} onClick={() => setCategory(c)}>{c}</div>
              ))}
            </div>
          </div>

          <div className={styles['filter-group']}>
            <label><input type="checkbox" checked={farmerOnly} onChange={(e) => setFarmerOnly(e.target.checked)} /> Farmer products only</label>
          </div>
          <div className={styles['filter-group']}>
            <label><input type="checkbox" checked={under100} onChange={(e) => setUnder100(e.target.checked)} /> Under 100₽</label>
          </div>
        </aside>

        <section>
          <div className={styles.grid}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>

        <aside className={styles.cart}>
          <h3>Cart</h3>
          {cart.length === 0 && <div style={{ color:'#6b7280' }}>Your cart is empty</div>}
          {cart.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700 }}>{item.name}</div>
                <div style={{ color:'#6b7280' }}>{item.price} ₽ × {item.qty}</div>
              </div>
              <div className={styles.qtyCtrl}>
                <button onClick={() => changeQty(item.id, -1)}>-</button>
                <div>{item.qty}</div>
                <button onClick={() => changeQty(item.id, 1)}>+</button>
                <button onClick={() => removeItem(item.id)} style={{ marginLeft:8 }}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{ marginTop:12, borderTop:'1px solid #f3f4f6', paddingTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><div>Subtotal</div><div>{subtotal} ₽</div></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><div>Delivery</div><div>{delivery} ₽</div></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, marginTop:8 }}><div>Total</div><div>{subtotal + delivery} ₽</div></div>
            <a href="/store/checkout" className="btn btn-primary" style={{ display:'inline-block', marginTop:12, textDecoration:'none' }}>Checkout</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
