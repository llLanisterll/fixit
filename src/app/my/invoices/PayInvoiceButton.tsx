"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { simulatePayment } from "@/actions/customer";
import { useNotification } from "@/components/NotificationContext";
import { CreditCard } from "lucide-react";

export default function PayInvoiceButton({ invoiceId }: { invoiceId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();

  async function handlePay() {
    setLoading(true);
    try {
      await simulatePayment(invoiceId);
      showToast("Pembayaran berhasil", "success");
      router.refresh();
    } catch (err) {
      showToast("Gagal melakukan pembayaran", "error");
    }
    setLoading(false);
  }

  return (
    <button className="btn btn-primary btn-sm mt-2" onClick={handlePay} disabled={loading} style={{ width: "100%" }}>
      {loading ? <span className="spinner" /> : <><CreditCard size={14} />Bayar</>}
    </button>
  );
}
