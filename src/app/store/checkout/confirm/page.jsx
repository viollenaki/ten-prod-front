"use client";

import React, { useEffect, useState } from 'react';
import styles from '../page.module.scss';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatSom } from '../../../utils/formatCurrency';

export default function ConfirmPage(){
  const router = useRouter();
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const orderId = params ? params.get('orderId') : null;
  const [order, setOrder] = useState(null);

  useEffect(()=>{
    try{
      if (typeof window !== 'undefined'){
        const orders = JSON.parse(window.localStorage.getItem('mockOrders')||'[]');
        const found = orders.find(o=>o.id === orderId) || orders[0] || null;
        setOrder(found);
      }
    }catch{ setOrder(null); }
  }, [orderId]);

  if (!order) return (
    <div className={`container ${styles.checkout}`}>
      <h1 className={styles.title}>Спасибо!</h1>
      <p>Ваш заказ создан. Перенаправляем...</p>
      <div style={{marginTop:12}}><a className="btn btn-primary" href="/store">Вернуться в каталог</a></div>
    </div>
  );

  return (
    <div className={`container ${styles.checkout}`}>
      <h1 className={styles.title}>Заказ принят</h1>
      <div className={styles.card}>
        <h2>Номер заказа: {order.id}</h2>
        <p>Спасибо! Ожидаемая доставка: ~{order.etaMinutes} минут.</p>

        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={()=>router.push('/store')}>Вернуться в каталог</button>
          <button className="btn btn-ghost" style={{marginLeft:8}}>Отследить заказ</button>
        </div>
      </div>
    </div>
  );
}
