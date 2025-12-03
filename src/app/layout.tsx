import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/desktop/Navbar";
import { SessionProvider } from "./hooks/sessionContext";
import { Toaster } from "react-hot-toast";
import HolyLoader from "holy-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog App",
  description: "a simple blog app to create and manage blog posts and users",
};

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
        <SessionProvider>
          <HolyLoader
            color="#6292df"
            height="0.3rem"
            speed={250}
            easing="linear"
          />
          <Toaster />
          <Navbar />
          <div className="p-6">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
