import React from 'react';
import styles from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.siteFooter}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerLinks}>
          <a href="#partners">Partners</a>
          <a href="#couriers">Couriers</a>
          <a href="#contact">Contact</a>
          <a href="/store">Store</a>
          <a href="/auth">Login / Sign up</a>
          <a href="/admin">Admin Login</a>
        </div>
        <div className={styles.footerCopy}>© {year} Fresh15 — All rights reserved</div>
      </div>
    </footer>
  );
}
