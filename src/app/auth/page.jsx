"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.scss';
import { api } from '../../utils/api';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  // role is only used for signup now, login role is determined by backend user
  const [role, setRole] = useState('user'); // default to 'user' (customer)
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'signup') {
        // Register
        await api.post('/auth/register', {
            email: form.email,
            password: form.password,
            name: form.name,
            role: role // backend expects "user", "farmer", "courier", "admin"
        });
        // Auto login after signup or ask user to login? 
        // Let's auto login or switch to login tab. For simplicity, switch to login tab.
        setTab('login');
        alert('Account created! Please log in.');
        setLoading(false);
      } else {
        // Login
        // backend expects form data for OAuth2
        const formData = new URLSearchParams();
        formData.append('username', form.email);
        formData.append('password', form.password);

        const res = await api.post('/auth/token', formData);
        api.setToken(res.access_token);
        
        // Get user info to redirect appropriately
        const user = await api.get('/auth/me');
        
        let dest = '/store';
        if (user.role === 'courier') dest = '/courier';
        if (user.role === 'farmer') dest = '/farmer';
        if (user.role === 'admin') dest = '/admin';
        
        router.replace(dest);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  }

  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-card']}> 
        <div className={styles.left}>
          <div className={styles.brand}>TenProducts</div>
          <div className={styles.lead}>Fresh farm products delivered in ~15 minutes.</div>

          <div className={styles.tabs} role="tablist" aria-label="Auth tabs">
            <button className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`${styles.tab} ${tab === 'signup' ? styles.active : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
          </div>

          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

          <form className={styles.form} onSubmit={onSubmit}>
            {tab === 'signup' && (
              <div className={styles.field}>
                <label>Name</label>
                <input name="name" value={form.name} onChange={onChange} className={styles.input} placeholder="Full name" required />
              </div>
            )}

            <div className={styles.field}>
              <label>Email</label>
              <input name="email" value={form.email} onChange={onChange} className={styles.input} placeholder="you@example.com" required />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input name="password" value={form.password} onChange={onChange} className={styles.input} type="password" placeholder="••••••" required />
            </div>

            {tab === 'signup' && (
                <div className={styles.field}>
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.select}>
                    <option value="user">Customer</option>
                    <option value="courier">Courier</option>
                    <option value="farmer">Farmer</option>
                    {/* <option value="admin">Admin</option> */} 
                </select>
                </div>
            )}

            <div className={styles.actions}>
              <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={loading}>
                {loading ? 'Processing...' : (tab === 'login' ? 'Log in' : 'Create account')}
              </button>
              <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={() => { setForm({ name: '', email: '', password: '' }); setError(''); }}>Reset</button>
            </div>
          </form>
        </div>

        <aside className={styles.right}>
          <h3>Why TenProducts?</h3>
          <p>Local produce, smart routing, and fast delivery. Sign up to start ordering or join as a courier to help deliver fresh food.</p>
        </aside>
      </div>
    </div>
  );
}
