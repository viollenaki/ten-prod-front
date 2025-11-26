"use client";

import React, { useState } from 'react';
import styles from './ProductsTable.module.scss';
import { formatSom } from '../../utils/formatCurrency';
import productsData from '../../data/products';

export default function ProductsTable(){
  const [products, setProducts] = useState(productsData);
  const [editing, setEditing] = useState(null);

  function saveEdit(updated){
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
  }

  function del(id){
    if (!confirm('Delete product?')) return;
    setProducts(prev => prev.filter(p=>p.id !== id));
  }

  return (
    <div>
      <h3>Products</h3>
      {products.length === 0 ? <div className={styles.empty}>No products</div> : (
        <table className={styles.table}>
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Farm</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><div className={styles.thumb}>Img</div></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatSom ? formatSom(p.price) : p.price + ' сом'}</td>
                <td>{p.isFarm ? 'Yes' : 'No'}</td>
                <td>{p.stock ?? '—'}</td>
                <td>
                  <button onClick={()=>setEditing(p)}>Edit</button>
                  <button onClick={()=>del(p.id)} className={styles.danger}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div className={styles.modal} role="dialog">
          <div className={styles.panel}>
            <h4>Edit {editing.name}</h4>
            <label>Name<input defaultValue={editing.name} onChange={(e)=>setEditing({...editing, name:e.target.value})} /></label>
            <label>Price<input type="number" defaultValue={editing.price} onChange={(e)=>setEditing({...editing, price: Number(e.target.value) })} /></label>
            <label>Category<input defaultValue={editing.category} onChange={(e)=>setEditing({...editing, category:e.target.value})} /></label>
            <div className={styles.actions}><button onClick={()=>saveEdit(editing)}>Save</button><button onClick={()=>setEditing(null)}>Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
