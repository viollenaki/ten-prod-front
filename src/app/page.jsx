import React from 'react';
import smartGoals from '../data/smartGoals';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className="container">
      <section className={styles.hero}>
        <div className={styles['hero-left']}>
          <div className={styles.headline}>Local farm produce, delivered professionally</div>
          <div className={styles.sub}>Quality from trusted farmers. Reliable delivery and clear pricing.</div>
          <div className={styles.cta}>
            <a className="btn btn-primary" href="/auth" aria-label="Start ordering">Start Ordering</a>
            <a className="btn btn-ghost" href="#how-it-works" aria-label="How it works">How it works</a>
          </div>
        </div>
        <div className={styles['hero-right']}>{/* TODO: Replace with product photography / hero image */}</div>
      </section>

      <section id="how-it-works" className={styles.section}>
        <h2>How it works</h2>
        <div className={styles.grid3}>
          <div className={styles.card}><h3>Choose products</h3><p>Browse fresh products from local farmers.</p></div>
          <div className={styles.card}><h3>Enter address</h3><p>We optimize routing for fastest delivery.</p></div>
          <div className={styles.card}><h3>Track delivery</h3><p>Follow your delivery — placeholder for future tracking.</p></div>
        </div>
      </section>

      <section id="benefits" className={styles.section}>
        <h2>Benefits</h2>
        <div className={styles.grid3}>
          <div className={styles.card}><h3>10% cheaper</h3><p>Save money compared to supermarkets.</p></div>
          <div className={styles.card}><h3>≈ 15-minute delivery</h3><p>Fast, optimized routes from local farms.</p></div>
          <div className={styles.card}><h3>20+ local partners</h3><p>Support local farmers and producers.</p></div>
        </div>
      </section>

      <section id="for-farmers" className={styles.section}>
        <h2>For Farmers</h2>
        <div className={styles.grid3}>
          <div className={styles.card}><h3>Fair prices</h3><p>Transparent fees and direct partnerships.</p></div>
          <div className={styles.card}><h3>Fast fulfillment</h3><p>Delivery partners handle logistics.</p></div>
          <div className={styles.card}><h3>Simple onboarding</h3><p>Quickly list products and manage availability.</p></div>
        </div>
      </section>

      <section id="smart-goals" className={styles.section}>
        <h2>SMART Goals</h2>
        <div className={styles.grid3}>
          {smartGoals.map(g => (
            <div className={styles.card} key={g.id}><h4>{g.title}</h4><p>{g.text}</p></div>
          ))}
        </div>
      </section>
    </main>
  );
}
