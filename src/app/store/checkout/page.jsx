"use client";

import React, { useEffect, useState, useRef } from 'react';
import styles from './page.module.scss';
import { formatSom } from '../../../utils/formatCurrency';
import { useRouter } from 'next/navigation';

// Checkout page — client component: handles cart reading from localStorage, form validation,
// and mock order creation. Backend integration would replace the mock localStorage write.
export default function CheckoutPage(){
	const router = useRouter();
	const containerRef = useRef(null);
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(false);
	const [savedAddressExists, setSavedAddressExists] = useState(false);

	// address fields (Russian labels as the site is RU-focused)
	const [address, setAddress] = useState({ city:'', street:'', house:'', apt:'', entrance:'', comment:'' });
	const [errors, setErrors] = useState({});
	const [payment, setPayment] = useState('cash');

	// load cart & saved address (SSR-safe)
	useEffect(()=>{
		try{ const c = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('cart')||'[]') : []; setCart(c); }catch{ setCart([]); }
		try{ const saved = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('savedAddress')||'null') : null; if (saved){ setSavedAddressExists(true); } }catch{}
	}, []);

	const subtotal = cart.reduce((s,i)=>s + (i.price||0) * (i.qty||1), 0);
	const delivery = cart.length ? 79 : 0;

	function validate(){
		const e = {};
		if (!address.city || address.city.trim().length < 2) e.city = 'Введите город';
		if (!address.street || address.street.trim().length < 2) e.street = 'Введите улицу';
		if (!address.house || address.house.trim().length < 1) e.house = 'Введите дом';
		// apt optional
		// payment must be selected
		if (!payment) e.payment = 'Выберите способ оплаты';
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function loadSavedAddress(){
		try{ const saved = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('savedAddress')||'null') : null; if (saved){ setAddress(saved); } }catch{}
	}

	async function handleConfirm(){
		if (cart.length === 0) { alert('Корзина пуста'); return; }
		if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
		setLoading(true);

		// simulate API call
		await new Promise(r => setTimeout(r, 900));

		// build mock order
		const order = {
			id: 'TP' + Date.now(),
			createdAt: new Date().toISOString(),
			items: cart,
			address,
			payment,
			subtotal,
			delivery,
			total: subtotal + delivery,
			etaMinutes: 15,
		};

		// save to localStorage as mockOrders — in real app this would be POST to backend
		try{
			if (typeof window !== 'undefined'){
				const existing = JSON.parse(window.localStorage.getItem('mockOrders')||'[]');
				window.localStorage.setItem('mockOrders', JSON.stringify([order, ...existing]));
				// clear cart after order
				window.localStorage.removeItem('cart');
			}
		}catch{}

		setLoading(false);
		// navigate to confirmation page and pass id via query
		router.push(`/store/checkout/confirm?orderId=${order.id}`);
	}

	return (
		<div className={`container ${styles.checkout}`}>
			<h1 className={styles.title}>Оформление заказа</h1>
			<div className={styles.grid}>
				<section className={styles.left}>
					<div className={styles.card}>
						<h2 className={styles.sectionTitle}>Адрес доставки</h2>

						{savedAddressExists && (
							<div className={styles.savedRow}>
								<button className={styles.linkBtn} onClick={loadSavedAddress}>Использовать сохранённый адрес</button>
							</div>
						)}

						<label className={styles.field}><span>Город</span>
							<input aria-invalid={!!errors.city} aria-describedby={errors.city ? 'err-city' : undefined} value={address.city} onChange={(e)=>setAddress({...address, city:e.target.value})} />
							{errors.city && <div id="err-city" className={styles.error}>{errors.city}</div>}
						</label>

						<label className={styles.field}><span>Улица</span>
							<input aria-invalid={!!errors.street} aria-describedby={errors.street ? 'err-street' : undefined} value={address.street} onChange={(e)=>setAddress({...address, street:e.target.value})} />
							{errors.street && <div id="err-street" className={styles.error}>{errors.street}</div>}
						</label>

						<div className={styles.rowTwo}>
							<label className={styles.field}><span>Дом / корпус</span>
								<input aria-invalid={!!errors.house} aria-describedby={errors.house ? 'err-house' : undefined} value={address.house} onChange={(e)=>setAddress({...address, house:e.target.value})} />
								{errors.house && <div id="err-house" className={styles.error}>{errors.house}</div>}
							</label>

							<label className={styles.field}><span>Квартира</span>
								<input value={address.apt} onChange={(e)=>setAddress({...address, apt:e.target.value})} />
							</label>
						</div>

						<label className={styles.field}><span>Подъезд / Этаж / Домофон</span>
							<input value={address.entrance} onChange={(e)=>setAddress({...address, entrance:e.target.value})} />
						</label>

						<label className={styles.field}><span>Комментарий для курьера</span>
							<textarea value={address.comment} onChange={(e)=>setAddress({...address, comment:e.target.value})} rows={3} />
						</label>
					</div>

					<div className={styles.card}>
						<h2 className={styles.sectionTitle}>Оплата</h2>
						<div className={styles.radioGroup} role="radiogroup" aria-label="Payment method">
							<label className={styles.radio}><input name="pay" type="radio" checked={payment==='cash'} onChange={()=>setPayment('cash')} /> Наличными курьеру</label>
							<label className={styles.radio}><input name="pay" type="radio" checked={payment==='card'} onChange={()=>setPayment('card')} /> Картой курьеру</label>
							<label className={styles.radio}><input name="pay" type="radio" checked={payment==='online'} onChange={()=>setPayment('online')} disabled /> Онлайн оплата (скоро)</label>
						</div>

						{payment === 'cash' && (
							<label className={styles.field}><span>Нужна сдача с</span>
								<input type="number" min="0" placeholder="e.g. 1000" onChange={(e)=>{ const v = Number(e.target.value); setAddress(a=>({ ...a, changeFrom: Number.isFinite(v) ? v : undefined })); }} />
							</label>
						)}

						{payment === 'card' && (
							<div className={styles.help}>Оплата картой будет возможна при доставке через терминал курьера.</div>
						)}

						<div className={styles.actions}>
							<button className={`btn btn-primary ${loading?styles.disabled:''}`} onClick={handleConfirm} disabled={loading}>{loading? 'Отправка...' : 'Подтвердить заказ'}</button>
							<a className="btn btn-ghost" href="/store">Назад в каталог</a>
						</div>
					</div>
				</section>

				<aside className={styles.right}>
					<div className={styles.summaryCard}>
						<h3 className={styles.sectionTitle}>Итог заказа</h3>
						<div className={styles.items}>
							{cart.length === 0 && <div className={styles.empty}>Ваша корзина пуста</div>}
							{cart.map(it => (
								<div key={it.id} className={styles.itemRow}>
									<div className={styles.itemLeft}><div className={styles.itemName}>{it.name}</div><div className={styles.itemMeta}>{it.qty} × {formatSom(it.price)}</div></div>
									<div className={styles.itemRight}>{formatSom((it.price||0) * (it.qty||1))}</div>
								</div>
							))}
						</div>

						<div className={styles.totals}>
							<div className={styles.totRow}><div>Подытог</div><div>{formatSom(subtotal)}</div></div>
							<div className={styles.totRow}><div>Доставка</div><div>{formatSom(delivery)}</div></div>
							<div className={`${styles.totRow} ${styles.totStrong}`}><div>Итого</div><div>{formatSom(subtotal + delivery)}</div></div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
