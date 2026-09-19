import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMPARIS — The Amparis Collective",
  description:
    "Onafhankelijke verhalen, onderzoek en collectieve data over macht, stilte en herstel.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
