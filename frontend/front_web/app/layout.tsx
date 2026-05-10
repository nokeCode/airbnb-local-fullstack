import type { Metadata } from "next";
import "./globals.css";
import Navbar  from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Immo Location ",
  description: "une application de location immobilière pour trouver votre maison de rêve",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased"
      >
     
        {children}
      </body>
    </html>
  );
}
