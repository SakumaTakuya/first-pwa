import type { Metadata } from "next";
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
  description: "This is a first pwa app.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "first-pwa",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansJp.variable} font-sans antialiased`}
      >
        <div className="min-h-dvh pb-32 animate-fade-in">
          {children}
        </div>
        <MainNav />
      </body>
    </html>
  );
}