"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Header.module.scss';
import scrollToAnchor from '../../utils/scrollToAnchor';
import { api } from '../../utils/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
        api.get('/auth/me')
           .then(u => setUser(u))
           .catch(() => {
               // Token invalid?
               api.removeToken();
               setUser(null);
           });
    } else {
        setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
      api.removeToken();
      setUser(null);
      router.push('/');
      router.refresh();
  };

  // handle nav clicks — if we're on home, smooth-scroll; otherwise navigate to home with hash then scroll
  const handleNav = (id) => {
    // close mobile menu
    setOpen(false);
    if (pathname === '/' || pathname === '') {
      // same page scroll
      scrollToAnchor(id);
      return;
    }
    // navigate to home with hash - then attempt scroll after navigation finishes
    // we use router.push with hash so URL reflects target; scrollToAnchor will retry once after a short delay
    router.push('/#' + id);
    // attempt a follow-up scroll after navigation
    setTimeout(() => scrollToAnchor(id), 160);
  };

  const getDashboardLink = () => {
      if (!user) return '/auth';
      if (user.role === 'farmer') return '/farmer';
      if (user.role === 'courier') return '/courier';
      if (user.role === 'admin') return '/admin';
      return '/store';
  };

  return (
    <header className={styles.siteHeader}>
      <div className={`container ${styles.headerInner}`}>
        <div className={styles.brand}>
          <a href="/" className={styles.logo}>TenProducts</a>
          <span className={styles.tag}>Fresh & Fast</span>
        </div>

        <nav className={styles.siteNav} aria-label="Main navigation">
          <a href="/store" className={styles.navLink}>Store</a>
          <button className={styles.navLink} onClick={() => handleNav('how-it-works')} aria-label="How it works">How it works</button>
          <button className={styles.navLink} onClick={() => handleNav('benefits')} aria-label="Benefits">Benefits</button>
          <button className={styles.navLink} onClick={() => handleNav('for-farmers')} aria-label="For farmers">For Farmers</button>
          
          {user && user.role === 'farmer' && (
              <a href="/farmer" className={styles.navLink} style={{color:'var(--color-primary)', fontWeight:600}}>Farmer Dashboard</a>
          )}
          {user && user.role === 'courier' && (
              <a href="/courier" className={styles.navLink} style={{color:'var(--color-primary)', fontWeight:600}}>Courier Dashboard</a>
          )}
          {user && user.role === 'admin' && (
              <a href="/admin" className={styles.navLink} style={{color:'var(--color-primary)', fontWeight:600}}>Admin</a>
          )}
          {user && user.role === 'user' && (
              <a href="/store/orders" className={styles.navLink}>My Orders</a>
          )}
        </nav>

        <div className={styles.headerActions}>
          {user ? (
            <>
                <span style={{fontSize:'0.9rem', color:'#666', marginRight:4}}>Hi, {user.name.split(' ')[0]}</span>
                <button className={`${styles.authBtn} ${styles.ghost}`} onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
                <a className={`${styles.authBtn} ${styles.ghost}`} href="/auth" aria-label="Log in">Log in</a>
                <a className={`${styles.authBtn} ${styles.primary}`} href="/auth" aria-label="Sign up">Sign up</a>
            </>
          )}
        </div>

        <button className={styles.hamburger} aria-label="Open menu" onClick={() => setOpen(v => !v)}>
          <span className={styles.hamburgerBox}><span className={styles.hamburgerInner}></span></span>
        </button>

        {open && (
          <div className={styles.mobileMenu} role="menu">
            <button className={styles.mobileItem} onClick={() => handleNav('how-it-works')}>How it works</button>
            <button className={styles.mobileItem} onClick={() => handleNav('benefits')}>Benefits</button>
            <button className={styles.mobileItem} onClick={() => handleNav('for-farmers')}>For Farmers</button>
            <a className={styles.mobileItem} href="/store">Store</a>
            {user ? (
                <>
                    <a className={styles.mobileItem} href={getDashboardLink()}>Dashboard</a>
                    {user.role === 'user' && <a className={styles.mobileItem} href="/store/orders">My Orders</a>}
                    <button className={styles.mobileItem} onClick={handleLogout} style={{textAlign:'left', color:'red'}}>Log out</button>
                </>
            ) : (
                <a className={styles.mobileItem} href="/auth">Sign up / Log in</a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
