import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebScaleKv — Современные сайты для бизнеса",
  description: "Разрабатываем лендинги, сайты-визитки и веб-приложения для малого бизнеса с помощью AI-инструментов. Быстро, современно, надёжно.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#6366f1] focus:text-white focus:rounded-lg">Перейти к содержимому</a>
        {children}
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
