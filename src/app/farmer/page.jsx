"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';

export default function FarmerPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders'); // orders, products, create

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
      name: '',
      price: '',
      stock: '',
      category_id: '',
      image_url: 'https://placehold.co/600x400'
  });

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
        router.push('/auth');
        return;
    }
    fetchData();
  }, [router]);

  async function fetchData() {
      try {
          const [ord, prod, cats] = await Promise.all([
              api.get('/farmer/orders'),
              api.get('/farmer/products'),
              api.get('/categories')
          ]);
          setOrders(ord);
          setProducts(prod);
          setCategories(cats);
          if (cats.length > 0) {
              setNewProduct(prev => ({ ...prev, category_id: cats[0].id }));
          }
      } catch (e) {
          console.error(e);
          if (e.message.includes('403')) {
              alert("Access denied. Farmer only.");
              router.push('/store');
          }
      } finally {
          setLoading(false);
      }
  }

  async function prepareOrder(id) {
      try {
          await api.put(`/farmer/orders/${id}/prepare`);
          fetchData();
      } catch (e) {
          console.error(e);
          alert("Failed to update order");
      }
  }

  async function handleCreateProduct(e) {
      e.preventDefault();
      try {
          // Ensure numeric values are valid
          const price = parseFloat(newProduct.price);
          const stock = parseInt(newProduct.stock);
          const categoryId = parseInt(newProduct.category_id);

          if (isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
              alert("Please enter valid numbers for price, stock, and category.");
              return;
          }

          await api.post('/products', {
              name: newProduct.name,
              price: price,
              stock: stock,
              category_id: categoryId,
              image_url: newProduct.image_url
          });
          alert("Product created successfully!");
          // Reset form and refresh products
          setNewProduct(prev => ({ ...prev, name: '', price: '', stock: '' }));
          const prod = await api.get('/farmer/products');
          setProducts(prod);
          setTab('products');
      } catch (err) {
          console.error(err);
          alert("Failed to create product: " + err.message);
      }
  }

  if (loading) return <div className="container" style={{padding:40}}>Loading farmer dashboard...</div>;

  return (
    <div className="container" style={{ padding:24 }}>
      <h1>Farmer Dashboard</h1>
      
      <div style={{marginBottom:24, borderBottom:'1px solid #e5e7eb', display:'flex', gap:24}}>
          <button 
            onClick={()=>setTab('orders')} 
            style={{
                padding:'12px 0', 
                background:'none', border:'none', 
                borderBottom: tab==='orders'?'2px solid #10b981':'2px solid transparent',
                fontWeight: tab==='orders'?700:400,
                cursor:'pointer'
            }}
          >
            Orders to Prepare
          </button>
          <button 
            onClick={()=>setTab('products')} 
            style={{
                padding:'12px 0', 
                background:'none', border:'none', 
                borderBottom: tab==='products'?'2px solid #10b981':'2px solid transparent',
                fontWeight: tab==='products'?700:400,
                cursor:'pointer'
            }}
          >
            My Products
          </button>
          <button 
            onClick={()=>setTab('create')} 
            style={{
                padding:'12px 0', 
                background:'none', border:'none', 
                borderBottom: tab==='create'?'2px solid #10b981':'2px solid transparent',
                fontWeight: tab==='create'?700:400,
                cursor:'pointer'
            }}
          >
            Add New Product
          </button>
      </div>

      {tab === 'orders' && (
        <div style={{ display:'grid', gap:16 }}>
            {orders.length === 0 && <p style={{color:'#666'}}>No active orders requiring preparation.</p>}
            {orders.map(o => (
                <div key={o.id} style={{ padding:16, borderRadius:12, background:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div>
                            <div style={{ fontWeight:700, fontSize:'1.1em' }}>Order #{o.id}</div>
                            <div style={{ color:'#6b7280', fontSize:'0.9em' }}>{new Date(o.created_at).toLocaleString()}</div>
                        </div>
                        <span style={{
                            padding:'4px 12px', borderRadius:16, fontSize:'0.85em', fontWeight:600,
                            background: o.status === 'accepted' ? '#dbeafe' : '#fef9c3',
                            color: o.status === 'accepted' ? '#1e40af' : '#854d0e'
                        }}>
                            {o.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <div style={{marginTop:16, borderTop:'1px solid #f3f4f6', paddingTop:12}}>
                        <div style={{fontWeight:600, marginBottom:8}}>Items:</div>
                        {o.items.map(item => (
                            <div key={item.id} style={{display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:'0.95em'}}>
                                <div>{item.product.name}</div>
                                <div>x{item.quantity}</div>
                            </div>
                        ))}
                    </div>

                    {['accepted', 'created'].includes(o.status) && (
                        <button 
                            onClick={() => prepareOrder(o.id)} 
                            className="btn btn-primary" 
                            style={{marginTop:16, width:'100%'}}
                        >
                            Start Preparing
                        </button>
                    )}
                     {o.status === 'preparing' && (
                        <div style={{marginTop:16, textAlign:'center', color:'#6b7280', fontSize:'0.9em'}}>
                            Order is being prepared. Wait for courier pickup.
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}

      {tab === 'products' && (
        <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
                {products.map(p => (
                    <div key={p.id} style={{ padding:12, borderRadius:12, background:'#fff', border:'1px solid #e5e7eb' }}>
                        <div style={{fontWeight:700}}>{p.name}</div>
                        <div style={{color:'#6b7280', fontSize:'0.9em'}}>{p.category?.name}</div>
                        <div style={{marginTop:8, fontWeight:600}}>{p.price} ₽</div>
                        <div style={{fontSize:'0.85em', color: p.stock > 10 ? 'green' : 'red'}}>Stock: {p.stock}</div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {tab === 'create' && (
          <div style={{maxWidth:500}}>
              <h2>Add New Product</h2>
              <form onSubmit={handleCreateProduct} style={{display:'flex', flexDirection:'column', gap:16, marginTop:16}}>
                  <div>
                      <label style={{display:'block', marginBottom:4, fontWeight:600}}>Product Name</label>
                      <input 
                        className="input" 
                        required 
                        value={newProduct.name} 
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="e.g. Fresh Tomatoes"
                      />
                  </div>
                  
                  <div style={{display:'flex', gap:16}}>
                    <div style={{flex:1}}>
                        <label style={{display:'block', marginBottom:4, fontWeight:600}}>Price (₽)</label>
                        <input 
                            className="input" 
                            type="number" 
                            required 
                            value={newProduct.price} 
                            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="0"
                        />
                    </div>
                    <div style={{flex:1}}>
                        <label style={{display:'block', marginBottom:4, fontWeight:600}}>Stock (Qty)</label>
                        <input 
                            className="input" 
                            type="number" 
                            required 
                            value={newProduct.stock} 
                            onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                            placeholder="0"
                        />
                    </div>
                  </div>

                  <div>
                      <label style={{display:'block', marginBottom:4, fontWeight:600}}>Category</label>
                      <select 
                        className="input" 
                        value={newProduct.category_id} 
                        onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
                      >
                          {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                      </select>
                  </div>

                  <div>
                      <label style={{display:'block', marginBottom:4, fontWeight:600}}>Image URL</label>
                      <input 
                        className="input" 
                        value={newProduct.image_url} 
                        onChange={e => setNewProduct({...newProduct, image_url: e.target.value})}
                        placeholder="https://..."
                      />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{marginTop:8}}>Create Product</button>
              </form>
          </div>
      )}
    </div>
  );
}
