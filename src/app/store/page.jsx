"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import products from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import FiltersSidebar from '../../components/FiltersSidebar/FiltersSidebar';
import ProductModal from '../../components/ProductModal/ProductModal';
import FloatingCartBar from '../../components/FloatingCartBar/FloatingCartBar';
import { formatSom } from '../../utils/formatCurrency';
import styles from './page.module.scss';

export default function StorePage() {
  const [filters, setFilters] = useState({ query: '', category: 'All', farmerOnly: false, favoritesOnly: false, maxPrice: 500 });
  const [cart, setCart] = useState([]);
  const [openCartMobile, setOpenCartMobile] = useState(false);
  const [preview, setPreview] = useState({ open:false, product:null });
  const [sort, setSort] = useState('popular');
  const [favorites, setFavorites] = useState([]);
  const routerRef = useRef(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], []);

  // load cart & favorites (SSR-safe)
  useEffect(()=>{
    try { const raw = typeof window !== 'undefined' ? window.localStorage.getItem('cart') : null; if (raw) setCart(JSON.parse(raw)); } catch { setCart([]); }
    try { const f = typeof window !== 'undefined' ? window.localStorage.getItem('favorites') : null; if (f) setFavorites(JSON.parse(f)); } catch {}
    routerRef.current = router;
  }, []);

  // debounce search input (300ms)
  useEffect(()=>{
    const t = setTimeout(()=>{
      setFilters(f => ({ ...f, query: searchTerm }));
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // persist cart
  useEffect(()=>{ try { if (typeof window !== 'undefined') window.localStorage.setItem('cart', JSON.stringify(cart)); } catch {} }, [cart]);

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + (product.qty||1) } : i);
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }

  function removeItem(id) { setCart(prev => prev.filter(i => i.id !== id)); }

  function resetFilters() { setFilters({ query:'', category:'All', farmerOnly:false, maxPrice:500 }); }

  const filtered = useMemo(()=>{
    const base = products.filter(p => {
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      if (filters.farmerOnly && !p.isFarm) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.favoritesOnly && !favorites.includes(p.id)) return false;
      return true;
    });

    if (sort === 'price_asc') return base.sort((a,b)=>a.price-b.price);
    if (sort === 'time') return base.sort((a,b)=>a.time-b.time);
    return base; // popular (default)
  }, [filters, sort]);

  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);

  return (
    <div className={styles.storePage}>
      <div className={`${styles.layoutTop} container`}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <input className={styles.searchCenter} placeholder="Search products, e.g. apples, milk..." aria-label="Search products" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
          </div>

          <select className={styles.catSelect} value={filters.category} onChange={(e)=>setFilters(f=>({ ...f, category: e.target.value }))} aria-label="Select category">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={`${styles.layout} `}>
          <aside className={styles.leftCol}>
            <FiltersSidebar categories={categories} filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
          </aside>

          <main className={styles.mainCol}>
            <div className={styles.toolbar}>
              <div className={styles.results}>Showing {filtered.length} products</div>
              <div className={styles.sortWrap}><label className={styles.sortLabel}>Sort</label>
                <select value={sort} onChange={(e)=>setSort(e.target.value)}>
                  <option value="popular">Popular</option>
                  <option value="price_asc">Price: low → high</option>
                  <option value="time">Delivery time</option>
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} onPreview={(pr)=>setPreview({ open:true, product:pr })} isFavorite={favorites.includes(p.id)} onToggleFavorite={(id)=>{
                  setFavorites(prev => {
                    const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id];
                    try { if (typeof window !== 'undefined') window.localStorage.setItem('favorites', JSON.stringify(next)); } catch {}
                    return next;
                  });
                }} />
              ))}
            </div>
          </main>

        </div>
      </div>

      <ProductModal product={preview.product} open={preview.open} onClose={()=>setPreview({ open:false, product:null })} onAdd={(p)=>{ addToCart(p); setPreview({ open:false, product:null }); }} />

      {/* aria-live region for assistive tech (announce cart changes) */}
      <div className={styles.srOnly} aria-live="polite">{`Cart ${cart.reduce((s,i)=>s+i.qty,0)} items — total ${formatSom(subtotal)}`}</div>

      {/* Floating bottom cart bar */}
      <FloatingCartBar itemsCount={cart.reduce((s,i)=>s+i.qty,0)} total={subtotal} onCheckout={()=>routerRef.current?.push('/store/checkout')} />
    </div>
  );
}
