"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <nav className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold">
                Borsa Advisor
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/recommendations"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Öneriler
                </Link>
                <Link
                  href="/portfolio"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Portföyüm
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
