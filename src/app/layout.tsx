import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jasa Cuci Sofa Purwakarta | MAKLIN Home Cleaning",
  description:
    "Jasa Cuci Sofa Purwakarta. Home service, peralatan modern, chemical aman untuk anak & hewan peliharaan. Bersih maksimal, cepat kering, wangi tahan lama. Hubungi sekarang!",
  keywords: [
    "cuci sofa purwakarta",
    "jasa cuci sofa",
    "home cleaning purwakarta",
    "cuci karpet purwakarta",
    "cuci kasur purwakarta",
    "cuci jok mobil purwakarta",
    "MAKLIN",
    "cuci kursi kantor",
    "deep cleaning sofa",
  ],
  authors: [{ name: "MAKLIN Home Cleaning" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Jasa Cuci Sofa Purwakarta | MAKLIN Home Cleaning",
    description:
      "Bersih Maksimal, Higienis, Wangi. Home service dengan peralatan modern dan chemical aman untuk keluarga.",
    url: "https://cucisofa.maklin.id",
    siteName: "MAKLIN Home Cleaning",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Cuci Sofa Purwakarta | MAKLIN Home Cleaning",
    description:
      "Bersih Maksimal, Higienis, Wangi. Home service dengan peralatan modern dan chemical aman.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}