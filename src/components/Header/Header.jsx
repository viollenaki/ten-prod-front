"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Header.module.scss';
import scrollToAnchor from '../../utils/scrollToAnchor';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  return (
    <header className={styles.siteHeader}>
      <div className={`container ${styles.headerInner}`}>
        <div className={styles.brand}>
          {/* TODO: Replace placeholder with official TenProduct SVG logo */}
          <a href="/" className={styles.logo} aria-label="TenProduct home">TenProduct</a>
          <span className={styles.tag}>Local produce. Professional delivery.</span>
        </div>

        <nav className={styles.siteNav} aria-label="Main navigation">
          <button className={styles.navLink} onClick={() => handleNav('how-it-works')} aria-label="How it works">How it works</button>
          <button className={styles.navLink} onClick={() => handleNav('benefits')} aria-label="Benefits">Benefits</button>
          <button className={styles.navLink} onClick={() => handleNav('for-farmers')} aria-label="For farmers">For Farmers</button>
          <button className={styles.navLink} onClick={() => handleNav('smart-goals')} aria-label="SMART goals">SMART Goals</button>
        </nav>

        <div className={styles.headerActions}>
          <a className={`${styles.authBtn} ${styles.ghost}`} href="/auth" aria-label="Account and login">Account</a>
          <a className={`${styles.authBtn} ${styles.primary}`} href="/store" aria-label="Start ordering">Start Ordering</a>
        </div>

        <button className={styles.hamburger} aria-label="Open menu" onClick={() => setOpen(v => !v)}>
          <span className={styles.hamburgerBox}><span className={styles.hamburgerInner}></span></span>
        </button>

        {open && (
          <div className={styles.mobileMenu} role="menu">
            <button className={styles.mobileItem} onClick={() => handleNav('how-it-works')}>How it works</button>
            <button className={styles.mobileItem} onClick={() => handleNav('benefits')}>Benefits</button>
            <button className={styles.mobileItem} onClick={() => handleNav('for-farmers')}>For Farmers</button>
            <button className={styles.mobileItem} onClick={() => handleNav('smart-goals')}>SMART Goals</button>
            <a className={styles.mobileItem} href="/store">Store</a>
            <a className={styles.mobileItem} href="/auth">Account</a>
          </div>
        )}
      </div>
    </header>
  );
}
