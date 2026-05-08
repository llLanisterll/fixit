"use client";
import { useState } from "react";
import { simulatePayment } from "@/actions/customer";
import { useToast } from "@/components/Toast";
import { CreditCard } from "lucide-react";

export default function PayInvoiceButton({ invoiceId }: { invoiceId: number }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handlePay() {
    setLoading(true);
    try {
      await simulatePayment(invoiceId);
      showToast("Pembayaran berhasil (Simulasi)", "success");
    } catch (err) {
      showToast("Gagal melakukan pembayaran", "error");
    }
    setLoading(false);
  }

  return (
    <button className="btn btn-primary btn-sm mt-2" onClick={handlePay} disabled={loading} style={{ width: "100%" }}>
      {loading ? <span className="spinner" /> : <><CreditCard size={14} /> Simulasi Bayar</>}
    </button>
  );
}
