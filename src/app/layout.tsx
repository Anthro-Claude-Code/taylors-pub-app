import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/lib/state";

const serif = Playfair_Display({
  variable: "--font-serif-var",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const sans = Inter({
  variable: "--font-sans-var",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Timothy Taylor's — Find a Pint",
  description:
    "Find Timothy Taylor's pubs, earn points, learn about cask ale, and stamp your beer passport.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e4538",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <StateProvider>{children}</StateProvider>
      </body>
    </html>
  );
}
