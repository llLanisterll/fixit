"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, X, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";
type Toast = { id: number; message: string; type: ToastType };

type ModalType = "alert" | "confirm" | null;
type ModalState = {
  type: ModalType;
  title: string;
  message: string;
  alertType?: ToastType;
  onConfirm?: () => void;
};

export const NotificationContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
  showAlert: (title: string, message: string, type?: ToastType) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}>({
  showToast: () => {},
  showAlert: () => {},
  showConfirm: () => {},
});

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalState>({ type: null, title: "", message: "" });

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const showAlert = useCallback((title: string, message: string, type: ToastType = "info") => {
    setModal({ type: "alert", title, message, alertType: type });
  }, []);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setModal({ type: "confirm", title, message, onConfirm });
  }, []);

  const closeModal = () => setModal((prev) => ({ ...prev, type: null }));

  return (
    <NotificationContext.Provider value={{ showToast, showAlert, showConfirm }}>
      {children}
      
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" && <CheckCircle size={16} />}
            {t.type === "error" && <XCircle size={16} />}
            {t.type === "warning" && <AlertTriangle size={16} />}
            {t.type === "info" && <Info size={16} />}
            <span>{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="toast-close">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal Container */}
      {modal.type && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className={`modal-box ${modal.type === "alert" ? `modal-${modal.alertType}` : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {modal.type === "alert" && modal.alertType === "success" && <CheckCircle size={28} className="modal-icon success" />}
              {modal.type === "alert" && modal.alertType === "error" && <XCircle size={28} className="modal-icon error" />}
              {modal.type === "alert" && modal.alertType === "warning" && <AlertTriangle size={28} className="modal-icon warning" />}
              {modal.type === "alert" && modal.alertType === "info" && <Info size={28} className="modal-icon info" />}
              {modal.type === "confirm" && <AlertTriangle size={28} className="modal-icon warning" />}
              <h2>{modal.title}</h2>
            </div>
            <div className="modal-body">
              <p>{modal.message}</p>
            </div>
            <div className="modal-footer">
              {modal.type === "alert" && (
                <button className="btn btn-primary" onClick={closeModal}>Mengerti</button>
              )}
              {modal.type === "confirm" && (
                <>
                  <button className="btn btn-secondary" onClick={closeModal}>Batal</button>
                  <button className="btn btn-danger" onClick={() => {
                    if (modal.onConfirm) modal.onConfirm();
                    closeModal();
                  }}>Ya, Lanjutkan</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
