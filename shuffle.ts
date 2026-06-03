import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Newton Drop",
  description: "A drag-and-drop physics learning MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
