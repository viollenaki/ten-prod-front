"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './checkout.module.scss';
import { api } from '../../../utils/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ city:'', street:'', house:'', apt:'' });
  const [payment, setPayment] = useState('cash');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
        router.push('/auth');
        return;
    }

    async function loadCart() {
        try {
            const cartItems = await api.get('/cart');
            if (cartItems.length === 0) {
                alert("Cart is empty");
                router.push('/store');
                return;
            }
            setCart(cartItems.map(i => ({
                ...i,
                qty: i.quantity,
                price: i.product.price
            })));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    loadCart();
  }, [router]);

  const subtotal = cart.reduce((s,i)=>s + (i.price||0) * (i.qty||1),0);
  const deliveryFee = 79;

  async function confirmOrder() {
    try {
        const fullAddress = `${address.city}, ${address.street}, ${address.house}, ${address.apt}`.replace(/^, /, '').replace(/, $/, '');
        if (!fullAddress.trim() || fullAddress.length < 5) {
            alert("Please enter a valid address");
            return;
        }

        const order = await api.post('/orders/', {
            address: fullAddress,
            payment_method: payment
        });

        setOrderResult(order);
        setStep(3);
    } catch (e) {
        console.error(e);
        alert("Failed to place order: " + e.message);
    }
  }

  if (loading) return <div className="container" style={{padding:40}}>Loading checkout...</div>;

  return (
    <div className={styles.checkout + ' container'}>
      <div className={styles.steps}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1 — Address</div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2 — Payment</div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3 — Confirmation</div>
      </div>

      {step === 1 && (
        <div className={styles.form}>
          <h3>Delivery address</h3>
          <div className={styles.row}>
            <div style={{flex:1}}>
              <label>City</label>
              <input value={address.city} onChange={(e)=>setAddress({...address, city:e.target.value})} className="input" placeholder="St. Petersburg" />
              <label>Street</label>
              <input value={address.street} onChange={(e)=>setAddress({...address, street:e.target.value})} className="input" placeholder="Nevsky Prospekt" />
            </div>
            <div style={{width:260}}>
              <label>House / building</label>
              <input value={address.house} onChange={(e)=>setAddress({...address, house:e.target.value})} className="input" />
              <label>Apartment</label>
              <input value={address.apt} onChange={(e)=>setAddress({...address, apt:e.target.value})} className="input" />
            </div>
          </div>
          <div style={{marginTop:12}} className={styles.row}>
            <div className={styles.map}>Map placeholder</div>
            <div style={{flex:1}}>
              <div className={styles.summary}><strong>Order summary</strong>
                <div>Items: {cart.length}</div>
                <div>Subtotal: ${subtotal}</div>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button className="btn btn-primary" onClick={()=>setStep(2)}>Continue to Payment</button>
            <a href="/store" className="btn btn-ghost">Back to catalog</a>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.form}>
          <h3>Payment method</h3>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            <label><input type="radio" name="pay" checked={payment==='cash'} onChange={()=>setPayment('cash')} /> Cash to courier</label>
            <label><input type="radio" name="pay" checked={payment==='card'} onChange={()=>setPayment('card')} /> Card to courier</label>
            <label><input type="radio" name="pay" checked={payment==='online'} onChange={()=>setPayment('online')} /> Online payment (placeholder)</label>
          </div>

          {payment === 'cash' && (
            <div style={{marginTop:8}}>
              <label>Need change from:</label>
              <input className="input" placeholder="e.g. $1000" />
            </div>
          )}

          <div className={styles.summary}>
            <div style={{display:'flex', justifyContent:'space-between'}}><div>Subtotal</div><div>${subtotal}</div></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><div>Delivery</div><div>${deliveryFee}</div></div>
            <div style={{display:'flex', justifyContent:'space-between', fontWeight:700}}><div>Total</div><div>${subtotal + deliveryFee}</div></div>
          </div>

          <div className={styles.actions}>
            <button className="btn btn-primary" onClick={confirmOrder}>Confirm Order</button>
            <button className="btn btn-ghost" onClick={()=>setStep(1)}>Back</button>
          </div>
        </div>
      )}

      {step === 3 && orderResult && (
        <div className={styles.form}>
          <div style={{textAlign:'center', padding:20}}>
            <div style={{fontSize:48, color:'#10b981'}}>✓</div>
            <h2>Order placed!</h2>
            <p>Order #{orderResult.id} placed! Average delivery time ~15 minutes.</p>
            <div style={{marginTop:12}}>
              <a href="/store" className="btn btn-primary">Back to catalog</a>
              {/* <a href="#" className="btn btn-ghost" style={{marginLeft:8}}>Track order</a> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
