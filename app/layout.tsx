import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ATB Client Hub",
  description: "Private workspace for ATB Visuals clients",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ATB Hub",
  },
  icons: {
    icon: "https://ik.imagekit.io/rgbcpayfx/launchericon-192x192.png",
    shortcut: "https://ik.imagekit.io/rgbcpayfx/launchericon-192x192.png",
    apple: "https://ik.imagekit.io/rgbcpayfx/launchericon-192x192.png",
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
        className={`${hanken.variable} ${jetbrains.variable} ${caveat.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}