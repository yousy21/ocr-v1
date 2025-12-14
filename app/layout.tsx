import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Dz Notary Platform",
  description: "Modern Algerian notary SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Load OpenCV only on the client */}
        <script async src="https://docs.opencv.org/4.7.0/opencv.js"></script>
      </head>

      <body className="min-h-screen bg-[#f7f7f8]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
