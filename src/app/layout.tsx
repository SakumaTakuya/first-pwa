import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  applicationName: "first-pwa",
  title: "first-pwa",
  description: "This is a first pwa app. 2",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "first-pwa",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1.0,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b111f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }
  ],
  colorScheme: "dark"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="bg-background">
      <body
        className={`${inter.variable} ${notoSansJp.variable} antialiased`}
      >
        <div className="min-h-dvh pb-32 animate-fade-in">
          {children}
        </div>
        <MainNav />
      </body>
    </html>
  );
}