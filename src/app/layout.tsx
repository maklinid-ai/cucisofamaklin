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
  metadataBase: new URL("https://cucisofa.maklin.id"),
  title: {
    default: "MAKLIN Home Cleaning | Jasa Cuci Sofa Purwakarta",
    template: "%s | MAKLIN Home Cleaning",
  },
  description:
    "Jasa Cuci Sofa, Kasur, Karpet, Kursi dan Jok Mobil di Purwakarta. Home Service, Chemical Aman, Teknisi Profesional, Booking Mudah.",
  keywords: [
    "cuci sofa Purwakarta",
    "home cleaning Purwakarta",
    "cuci kasur Purwakarta",
    "cuci karpet Purwakarta",
    "cuci kursi Purwakarta",
    "cuci jok mobil Purwakarta",
    "MAKLIN Home Cleaning",
    "jasa cuci sofa Purwakarta",
    "home service Purwakarta",
  ],
  authors: [
    {
      name: "MAKLIN Home Cleaning",
      url: "https://cucisofa.maklin.id",
    },
  ],
  creator: "MAKLIN Home Cleaning",
  publisher: "MAKLIN Home Cleaning",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://cucisofa.maklin.id",
    languages: {
      "id-ID": "https://cucisofa.maklin.id",
    },
  },
  openGraph: {
    title: "MAKLIN Home Cleaning | Jasa Cuci Sofa Purwakarta",
    description:
      "Jasa Cuci Sofa, Kasur, Karpet, Kursi dan Jok Mobil di Purwakarta. Home Service, Chemical Aman, Teknisi Profesional.",
    url: "https://cucisofa.maklin.id",
    siteName: "MAKLIN Home Cleaning",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "https://cucisofa.maklin.id/images/maklin-sofa.jpeg",
        width: 1200,
        height: 630,
        alt: "Teknisi MAKLIN Home Cleaning membersihkan sofa di Purwakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAKLIN Home Cleaning | Jasa Cuci Sofa Purwakarta",
    description:
      "Jasa Cuci Sofa, Kasur, Karpet, Kursi dan Jok Mobil di Purwakarta. Home Service, Chemical Aman, Teknisi Profesional.",
    images: ["https://cucisofa.maklin.id/images/maklin-sofa.jpeg"],
  },
  icons: {
    icon: "/logo-web-page.png",
    shortcut: "/logo-web-page.png",
    apple: "/logo-web-page.png",
    other: [
      {
        rel: "manifest",
        url: "/manifest.webmanifest",
      },
    ],
  },
  applicationName: "MAKLIN Home Cleaning",
  themeColor: "#29986A",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://cucisofa.maklin.id/#website",
                  "url": "https://cucisofa.maklin.id",
                  "name": "MAKLIN Home Cleaning",
                  "description": "Jasa Cuci Sofa, Kasur, Karpet, Kursi dan Jok Mobil di Purwakarta. Home Service, Chemical Aman, Teknisi Profesional.",
                  "publisher": {
                    "@id": "https://cucisofa.maklin.id/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://cucisofa.maklin.id/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://cucisofa.maklin.id/#organization",
                  "name": "MAKLIN Home Cleaning",
                  "url": "https://cucisofa.maklin.id",
                  "logo": "https://cucisofa.maklin.id/logo-web-page.png",
                  "sameAs": [
                    "https://www.instagram.com/maklin_megacemerlang.purwakarta",
                    "https://www.facebook.com/maklin.homecleaning",
                    "https://www.youtube.com/channel/UCMAKLIN"
                  ]
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://cucisofa.maklin.id/#localbusiness",
                  "name": "MAKLIN Home Cleaning",
                  "image": "https://cucisofa.maklin.id/logo-web-page.png",
                  "description": "Jasa Cuci Sofa, Kasur, Karpet, Kursi dan Jok Mobil di Purwakarta. Home service dengan chemical aman dan teknisi profesional.",
                  "telephone": "+6285793676315",
                  "priceRange": "Rp",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Jl. Jend. A Yani 113",
                    "addressLocality": "Purwakarta",
                    "addressRegion": "Jawa Barat",
                    "postalCode": "411xx",
                    "addressCountry": "ID"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": -6.5562,
                    "longitude": 107.4448
                  },
                  "areaServed": ["Purwakarta", "Subang", "Karawang", "Bandung Barat"],
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                      ],
                      "opens": "07:30",
                      "closes": "16:30"
                    }
                  ],
                  "sameAs": [
                    "https://www.instagram.com/maklin_megacemerlang.purwakarta",
                    "https://www.facebook.com/maklin.homecleaning",
                    "https://www.youtube.com/channel/UCMAKLIN"
                  ],
                  "url": "https://cucisofa.maklin.id"
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://cucisofa.maklin.id"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Home Cleaning",
                      "item": "https://cucisofa.maklin.id"
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Apakah sofa dibawa ke workshop MAKLIN?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Tidak, kami menggunakan sistem home service. Tim kami akan datang langsung ke lokasi Anda untuk melakukan pembersihan sofa. Jadi Anda tidak perlu repot membawa sofa ke mana-mana."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Apakah chemical yang digunakan aman?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ya, semua chemical yang kami gunakan aman untuk anak-anak dan hewan peliharaan. Kami menggunakan produk berkualitas premium yang telah teruji dan ramah lingkungan."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Berapa lama proses pengerjaan cuci sofa?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Proses pengerjaan cuci sofa biasanya memakan waktu 1-2 jam tergantung pada ukuran sofa, jenis bahan, dan tingkat kekotoran."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Apakah bisa menghilangkan noda yang membandel?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ya, dengan peralatan profesional dan chemical khusus, kami bisa menghilangkan berbagai jenis noda membandel termasuk noda minuman, makanan, dan noda organik lainnya."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Berapa lama sofa kering setelah dicuci?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Dengan teknologi extraction profesional, sofa Anda akan kering lebih cepat dibandingkan metode biasa. Biasanya sofa sudah cukup kering dalam 2-4 jam."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "MAKLIN melayani area mana saja?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kami melayani seluruh wilayah Purwakarta dan sekitarnya termasuk Purwakarta Kota, Bungursari, Campaka, Jatiluhur, Plered, Pasawahan, dan lainnya."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Bagaimana cara memesan jasa cuci sofa MAKLIN?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Anda bisa memesan melalui WhatsApp di nomor 0857-9367-6315 atau mengisi formulir booking di website ini. Tim kami akan segera menghubungi Anda untuk konfirmasi."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Apakah ada garansi hasil pengerjaan?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ya, kami memberikan garansi H+3 (3 hari setelah pengerjaan). Jika ada bagian yang belum maksimal, kami akan melakukan touch-up tanpa biaya tambahan."
                      }
                    }
                  ]
                },
                {
                  "@type": "Service",
                  "name": "Cuci Sofa",
                  "description": "Pembersihan sofa profesional di rumah dengan teknologi extraction untuk hasil cepat kering dan higienis.",
                  "serviceType": "Cuci Sofa",
                  "provider": {
                    "@type": "LocalBusiness",
                    "name": "MAKLIN Home Cleaning"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Cuci Kasur",
                  "description": "Perawatan kasur profesional di Purwakarta untuk mengangkat debu, tungau, dan noda.",
                  "serviceType": "Cuci Kasur",
                  "provider": {
                    "@type": "LocalBusiness",
                    "name": "MAKLIN Home Cleaning"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Cuci Karpet",
                  "description": "Layanan cuci karpet home service untuk karpet bersih, wangi, dan bebas debu.",
                  "serviceType": "Cuci Karpet",
                  "provider": {
                    "@type": "LocalBusiness",
                    "name": "MAKLIN Home Cleaning"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Cuci Kursi",
                  "description": "Pembersihan kursi rumah dan kantor dengan proses aman dan cepat.",
                  "serviceType": "Cuci Kursi",
                  "provider": {
                    "@type": "LocalBusiness",
                    "name": "MAKLIN Home Cleaning"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Cuci Jok Mobil",
                  "description": "Service cuci jok mobil dengan penghilangan noda dan pembersihan interior kendaraan.",
                  "serviceType": "Cuci Jok Mobil",
                  "provider": {
                    "@type": "LocalBusiness",
                    "name": "MAKLIN Home Cleaning"
                  }
                }
              ]
            }
          `}
        </Script>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
