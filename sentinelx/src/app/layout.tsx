import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veritas — Autonomous Security Investigation Platform",
  description:
    "AI-native operating system for SOC analysts. Investigate security incidents with autonomous AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
