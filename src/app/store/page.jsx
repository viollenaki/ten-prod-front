"use client";

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './page.module.scss';
import { api } from '../../utils/api';

export default function StorePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [farmerOnly, setFarmerOnly] = useState(false);
  const [under100, setUnder100] = useState(false);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = api.getToken();
    setIsLoggedIn(!!token);

    async function fetchData() {
      try {
        // Fetch products
        const prods = await api.get('/products');
        setProducts(prods);

        // Fetch categories
        const cats = await api.get('/categories');
        setCategories(['All', ...cats.map(c => c.name)]);

        // Fetch cart if logged in
        if (token) {
          const cartItems = await api.get('/cart');
          // Transform backend cart items to frontend format if needed
          // Backend: { id, product_id, quantity, product: { ... } }
          // Frontend expected: { id (product_id?), name, price, qty } 
          // My frontend previous logic used product.id as item.id. 
          // Backend cart item has its own id.
          // Let's map it.
          setCart(cartItems.map(i => ({
            cartItemId: i.id, // ID of the cart item entry
            id: i.product.id, // ID of the product
            name: i.product.name,
            price: i.product.price,
            qty: i.quantity
          })));
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function addToCart(product) {
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }

    try {
      // Backend expects: { product_id, quantity }
      const res = await api.post('/cart', { product_id: product.id, quantity: 1 });
      // Refresh cart or update state locally
      // Backend returns the new cart item.
      // We need to know if it merged or created new.
      // Easiest is to re-fetch cart or smarter update.
      // Let's re-fetch for correctness.
      const cartItems = await api.get('/cart');
      setCart(cartItems.map(i => ({
            cartItemId: i.id,
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            qty: i.quantity
      })));
    } catch (e) {
      console.error("Failed to add to cart", e);
      alert("Failed to add to cart");
    }
  }

  async function changeQty(item, delta) {
    if (!isLoggedIn) return;
    
    const newQty = item.qty + delta;
    if (newQty < 1) return;

    try {
      await api.put(`/cart/${item.cartItemId}`, { quantity: newQty });
      // Update local state
      setCart(prev => prev.map(i => i.cartItemId === item.cartItemId ? { ...i, qty: newQty } : i));
    } catch (e) {
      console.error(e);
    }
  }

  async function removeItem(item) {
    if (!isLoggedIn) return;
    try {
        await api.delete(`/cart/${item.cartItemId}`);
        setCart(prev => prev.filter(i => i.cartItemId !== item.cartItemId));
    } catch (e) {
        console.error(e);
    }
  }

  // Client-side filtering on the fetched products
  const filtered = products.filter(p => {
    if (category !== 'All' && p.category?.name !== category) return false;
    // Backend doesn't explicitly have isFarm on Product model, it has supplier.
    // Let's assume if supplier is set or some logic.
    // For now, I'll ignore farmerOnly or map it if I added a field. 
    // My backend model for Product doesn't have 'isFarm'. It has 'supplier'.
    // I'll assume all products are from farmers for now or ignore this filter.
    // Or I can check if supplier name contains "Farm".
    if (farmerOnly && !p.supplier) return false; 
    if (under100 && p.price > 100) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = cart.length ? 79 : 0;

  if (loading) return <div className="container" style={{padding:40}}>Loading store...</div>;

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
            <label><input type="checkbox" checked={farmerOnly} onChange={(e) => setFarmerOnly(e.target.checked)} /> Has Supplier</label>
          </div>
          <div className={styles['filter-group']}>
            <label><input type="checkbox" checked={under100} onChange={(e) => setUnder100(e.target.checked)} /> Under 100₽</label>
          </div>
        </aside>

        <section>
          <div className={styles.grid}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={{
                  ...p, 
                  // Adapter for ProductCard which expects specific fields
                  category: p.category?.name || 'General',
                  unit: 'pc', // default, not in backend model explicitly
                  time: 15, // mock
                  isFarm: !!p.supplier
              }} onAdd={() => addToCart(p)} />
            ))}
          </div>
        </section>

        <aside className={styles.cart}>
          <h3>Cart</h3>
          {!isLoggedIn && <div style={{marginBottom:10}}><a href="/auth" style={{color:'var(--color-primary)'}}>Log in</a> to manage cart</div>}
          {cart.length === 0 && <div style={{ color:'#6b7280' }}>Your cart is empty</div>}
          {cart.map(item => (
            <div key={item.cartItemId} className={styles.cartItem}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700 }}>{item.name}</div>
                <div style={{ color:'#6b7280' }}>{item.price} ₽ × {item.qty}</div>
              </div>
              <div className={styles.qtyCtrl}>
                <button onClick={() => changeQty(item, -1)}>-</button>
                <div>{item.qty}</div>
                <button onClick={() => changeQty(item, 1)}>+</button>
                <button onClick={() => removeItem(item)} style={{ marginLeft:8 }}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{ marginTop:12, borderTop:'1px solid #f3f4f6', paddingTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><div>Subtotal</div><div>{subtotal} ₽</div></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><div>Delivery</div><div>{delivery} ₽</div></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, marginTop:8 }}><div>Total</div><div>{subtotal + delivery} ₽</div></div>
            {isLoggedIn && cart.length > 0 && (
                <button 
                    onClick={async () => {
                        // Create order immediately or go to checkout page?
                        // Backend create_order requires address and payment method.
                        // I'll navigate to checkout page, but I need to ensure checkout page uses the API too.
                        router.push('/store/checkout');
                    }}
                    className="btn btn-primary" 
                    style={{ display:'inline-block', marginTop:12, textDecoration:'none', width:'100%', textAlign:'center', border:'none', cursor:'pointer' }}
                >
                    Checkout
                </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
