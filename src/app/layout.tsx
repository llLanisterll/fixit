import type { Metadata } from "next";
import "./globals.css";

import { NotificationProvider } from "@/components/NotificationContext";

export const metadata: Metadata = {
  title: "FixIt - Sistem Manajemen Pemesanan Jasa Service Kendaraan",
  description: "Platform booking servis kendaraan online. Reservasi tanpa antre, pilih mekanik, pantau status real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
