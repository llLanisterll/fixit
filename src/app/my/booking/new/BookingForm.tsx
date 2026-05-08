"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/actions/bookings";
import { CalendarCheck, Car, Wrench, Users, ChevronRight, ChevronLeft, Check } from "lucide-react";

const timeSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"];

export default function BookingForm({ vehicles, services, mechanics, userId }: { vehicles: any[]; services: any[]; mechanics: any[]; userId: number }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [mechanicId, setMechanicId] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPrice = services.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = services.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.estimatedMinutes, 0);

  async function handleSubmit() {
    if (!vehicleId || selectedServices.length === 0 || !bookingDate || !timeSlot) return;
    setLoading(true);
    await createBooking({ userId, vehicleId, mechanicId: mechanicId || undefined, bookingDate, timeSlot, notes, serviceIds: selectedServices });
    router.push("/my/bookings");
  }

  const steps = [
    { num: 1, label: "Kendaraan", icon: <Car size={14} /> },
    { num: 2, label: "Layanan", icon: <Wrench size={14} /> },
    { num: 3, label: "Jadwal & Mekanik", icon: <Users size={14} /> },
    { num: 4, label: "Konfirmasi", icon: <Check size={14} /> },
  ];

  return (
    <>
      <div className="page-header"><div><h1><CalendarCheck size={24} style={{ display: "inline", marginRight: "8px" }} />Booking Baru</h1><p>Buat reservasi servis kendaraan Anda</p></div></div>
      <div className="booking-steps">
        {steps.map(s => (
          <div key={s.num} className={`booking-step ${step === s.num ? "active" : step > s.num ? "completed" : ""}`}>
            {s.icon} {s.label}
          </div>
        ))}
      </div>
      <div className="card">
        {step === 1 && (
          <>
            <h3 style={{ marginBottom: "16px" }}>Pilih Kendaraan</h3>
            {vehicles.length === 0 ? (
              <div className="empty-state"><p>Belum ada kendaraan. <a href="/my/vehicles" style={{ color: "var(--accent)" }}>Tambah kendaraan</a> terlebih dahulu.</p></div>
            ) : (
              <div className="mechanic-grid">
                {vehicles.map(v => (
                  <div key={v.id} className={`mechanic-card ${vehicleId === v.id ? "selected" : ""}`} onClick={() => setVehicleId(v.id)}>
                    <div className="avatar"><Car size={24} /></div>
                    <h4>{v.brand} {v.model}</h4>
                    <p>{v.licensePlate} • {v.year}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <h3 style={{ marginBottom: "8px" }}>Pilih Layanan Servis</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>Pilih satu atau lebih layanan yang dibutuhkan</p>
            <div className="service-picker">
              {services.map(s => (
                <label key={s.id} className={`service-option ${selectedServices.includes(s.id) ? "selected" : ""}`}>
                  <input type="checkbox" checked={selectedServices.includes(s.id)} onChange={() => setSelectedServices(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])} />
                  <div className="service-info">
                    <h4>{s.name}</h4>
                    <p>{s.description}</p>
                    <span className={`badge badge-${s.category.toLowerCase()}`} style={{ marginTop: "4px" }}>{s.category}</span>
                  </div>
                  <div className="service-price">Rp {s.price.toLocaleString("id-ID")}</div>
                </label>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(59,130,246,0.08)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between" }}>
                <span>{selectedServices.length} layanan dipilih • ~{totalMinutes} menit</span>
                <strong style={{ color: "var(--accent)" }}>Rp {totalPrice.toLocaleString("id-ID")}</strong>
              </div>
            )}
          </>
        )}
        {step === 3 && (
          <>
            <h3 style={{ marginBottom: "16px" }}>Pilih Jadwal & Mekanik</h3>
            <div className="grid-2 mb-6">
              <div className="form-group"><label className="form-label">Tanggal Booking</label><input type="date" className="form-input" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required /></div>
              <div className="form-group"><label className="form-label">Jam</label>
                <select className="form-input" value={timeSlot} onChange={e => setTimeSlot(e.target.value)} required>
                  <option value="">Pilih jam...</option>
                  {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Catatan (opsional)</label><textarea className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Keluhan atau catatan tambahan..." /></div>
            <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Pilih Mekanik (opsional)</h4>
            <div className="mechanic-grid">
              <div className={`mechanic-card ${mechanicId === null ? "selected" : ""}`} onClick={() => setMechanicId(null)}>
                <div className="avatar">🔄</div><h4>Otomatis</h4><p>Ditentukan bengkel</p>
              </div>
              {mechanics.map(m => (
                <div key={m.id} className={`mechanic-card ${mechanicId === m.id ? "selected" : ""}`} onClick={() => setMechanicId(m.id)}>
                  <div className="avatar">{m.name[0]}</div><h4>{m.name}</h4><p>{m.specialization || "Umum"}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h3 style={{ marginBottom: "16px" }}>Konfirmasi Booking</h3>
            <div className="detail-grid mb-6">
              <div className="detail-item"><div className="label">Kendaraan</div><div className="value">{vehicles.find(v => v.id === vehicleId)?.brand} {vehicles.find(v => v.id === vehicleId)?.model} ({vehicles.find(v => v.id === vehicleId)?.licensePlate})</div></div>
              <div className="detail-item"><div className="label">Tanggal</div><div className="value">{bookingDate} • {timeSlot}</div></div>
              <div className="detail-item"><div className="label">Mekanik</div><div className="value">{mechanicId ? mechanics.find(m => m.id === mechanicId)?.name : "Otomatis"}</div></div>
              {notes && <div className="detail-item"><div className="label">Catatan</div><div className="value">{notes}</div></div>}
            </div>
            <h4 style={{ marginBottom: "8px", fontSize: "14px" }}>Layanan Dipilih</h4>
            <div style={{ background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", padding: "16px", marginBottom: "16px" }}>
              {services.filter(s => selectedServices.includes(s.id)).map(s => (
                <div key={s.id} className="flex justify-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{s.name}</span><span style={{ fontWeight: 600 }}>Rp {s.price.toLocaleString("id-ID")}</span>
                </div>
              ))}
              <div className="flex justify-between" style={{ padding: "12px 0 0", fontSize: "18px", fontWeight: 800 }}>
                <span>Estimasi Total</span><span style={{ color: "var(--accent)" }}>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-between mt-4">
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}><ChevronLeft size={16} /> Kembali</button>}
          <div style={{ marginLeft: "auto" }}>
            {step < 4 ? (
              <button className="btn btn-primary" disabled={(step === 1 && !vehicleId) || (step === 2 && selectedServices.length === 0) || (step === 3 && (!bookingDate || !timeSlot))} onClick={() => setStep(step + 1)}>
                Lanjut <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : <><CalendarCheck size={18} /> Konfirmasi Booking</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
