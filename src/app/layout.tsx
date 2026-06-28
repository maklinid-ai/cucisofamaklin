import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    icon: "/logo-web-page.png",
    shortcut: "/logo-web-page.png",
    apple: "/logo-web-page.png",
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
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`
            (function () {
              var ATTRIBUTE = 'fdprocessedid';

              function stripAttribute(root) {
                if (!root || root.nodeType !== 1) return;
                if (root.hasAttribute && root.hasAttribute(ATTRIBUTE)) {
                  root.removeAttribute(ATTRIBUTE);
                }
                if (root.querySelectorAll) {
                  root.querySelectorAll('[' + ATTRIBUTE + ']').forEach(function (element) {
                    element.removeAttribute(ATTRIBUTE);
                  });
                }
              }

              function start() {
                if (!document.body) return;
                stripAttribute(document.body);
                new MutationObserver(function (mutations) {
                  mutations.forEach(function (mutation) {
                    if (mutation.type === 'attributes') {
                      stripAttribute(mutation.target);
                    } else {
                      mutation.addedNodes.forEach(stripAttribute);
                    }
                  });
                }).observe(document.body, {
                  attributes: true,
                  attributeFilter: [ATTRIBUTE],
                  childList: true,
                  subtree: true
                });
              }

              if (document.body) {
                start();
              } else {
                document.addEventListener('DOMContentLoaded', start, { once: true });
              }
            })();
          `}
        </Script>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
