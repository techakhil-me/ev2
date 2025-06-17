import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PNG Sequence Animation Demo",
  description: "Scroll-triggered PNG sequence animation with Lenis smooth scroll",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LenisProvider>
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
