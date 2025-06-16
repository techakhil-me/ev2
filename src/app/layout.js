import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PNG Sequence Animation Demo",
  description: "Scroll-triggered PNG sequence animation with Lenis smooth scroll",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LenisProvider>{children}</LenisProvider>
        {/* {children} */}
        <Footer />
      </body>
    </html>
  );
}
