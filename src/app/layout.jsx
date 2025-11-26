
import '../styles/globals.scss';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export const metadata = {
  title: 'TenProduct — Fresh farmer products delivered fast',
  description: 'TenProduct connects local farmers with customers for fast, reliable delivery of fresh produce.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="app-root">
        <div className="page-wrapper">
          <Header />
          <main className="container main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

