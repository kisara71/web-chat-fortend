import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web-Chat",
  description: "Web-Chat frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
