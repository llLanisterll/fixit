import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixIt - Sistem Manajemen Pemesanan Jasa Service Kendaraan",
  description: "Platform booking servis kendaraan online. Reservasi tanpa antre, pilih mekanik, pantau status real-time.",
};

import { ToastProvider } from "@/components/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
