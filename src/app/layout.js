import "./globals.css";
import LenisProvider from "../components/LenisProvider";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "PNG Sequence Animation Demo",
  description: "Scroll-triggered PNG sequence animation with Lenis smooth scroll",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 100 }}>
        <LenisProvider>
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
