"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.scss';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    // Simulated auth/signup flow. No backend.
    // Redirect based on selected role.
    const dest = role === 'customer' ? '/store' : role === 'courier' ? '/courier' : '/admin';
    // Use App Router replace to avoid extra history entry
    setTimeout(() => router.replace(dest), 200);
  }

  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-card']}> 
        <div className={styles.left}>
          <div className={styles.brand}>Fresh15</div>
          <div className={styles.lead}>Fresh farm products delivered in ~15 minutes.</div>

          <div className={styles.tabs} role="tablist" aria-label="Auth tabs">
            <button className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`${styles.tab} ${tab === 'signup' ? styles.active : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            {tab === 'signup' && (
              <div className={styles.field}>
                <label>Name</label>
                <input name="name" value={form.name} onChange={onChange} className={styles.input} placeholder="Full name" />
              </div>
            )}

            <div className={styles.field}>
              <label>Email or phone</label>
              <input name="email" value={form.email} onChange={onChange} className={styles.input} placeholder="you@example.com" />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input name="password" value={form.password} onChange={onChange} className={styles.input} type="password" placeholder="••••••" />
            </div>

            <div className={styles.field}>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.select}>
                <option value="customer">Customer</option>
                <option value="courier">Courier</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={`${styles.btn} ${styles.primary}`}>{tab === 'login' ? 'Log in' : 'Create account'}</button>
              <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={() => { setForm({ name: '', email: '', password: '' }); setRole('customer'); }}>Reset</button>
            </div>
          </form>
        </div>

        <aside className={styles.right}>
          <h3>Why Fresh15?</h3>
          <p>Local produce, smart routing, and fast delivery. Sign up to start ordering or join as a courier to help deliver fresh food.</p>
          <p style={{ marginTop:12, color:'#4b5563' }}>Choose a role and click {tab === 'login' ? 'Log in' : 'Create account'} to simulate navigation.</p>
        </aside>
      </div>
    </div>
  );
}
