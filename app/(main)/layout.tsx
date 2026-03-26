import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import NavBar from "../components/layout/navBar/navBar";
import Footer from "../components/layout/Footer/Footer";
import { icons } from "lucide-react";

export const metadata = {
  title: {
    default: "LuxVera",
    template: "%s | LuxVera",
  },
  icons: {
    icon: "/favicon.svg",
  },
  description: "Luxury construction and smart living.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
