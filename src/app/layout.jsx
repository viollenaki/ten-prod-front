
import '../styles/globals.scss';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export const metadata = {
  title: 'Fresh15 — Fresh farm products delivered in 15 minutes',
  description: 'Fresh farm products delivered fast. Local farmers, smart routing, great prices.',
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

