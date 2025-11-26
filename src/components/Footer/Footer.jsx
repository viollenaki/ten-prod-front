import React from 'react';
import styles from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.siteFooter}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerCol}>
          <h4>Company</h4>
          <div className={styles.footerLinks}>
            <a href="/">About TenProduct</a>
            <a href="/store">Careers</a>
            <a href="/admin">Press</a>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4>For Partners</h4>
          <div className={styles.footerLinks}>
            <a href="/store">Sell with us</a>
            <a href="/auth">Partner login</a>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4>Help</h4>
          <div className={styles.footerLinks}>
            <a href="/store">Customer support</a>
            <a href="/store/checkout">Orders & returns</a>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4>Legal</h4>
          <div className={styles.footerLinks}>
            <a href="/">Terms</a>
            <a href="/">Privacy</a>
          </div>
          <div className={styles.footerCopy}>© {year} TenProduct — All rights reserved</div>
        </div>
        <div className={styles.footerCopy}>© {year} TenProducts — All rights reserved</div>
      </div>
    </footer>
  );
}
