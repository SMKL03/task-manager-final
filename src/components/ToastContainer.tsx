"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const [toasts, setToasts] = useState<any[]>([]);

  useEffect(() => {
    // Fungsi untuk menangkap pesan "toast" dari seluruh aplikasi
    const handler = (e: any) => {
      const id = Math.random().toString(36).substring(2, 9);
      const { message, type } = e.detail;
      
      setToasts((prev) => [...prev, { id, message, type }]);

      // Hapus toast otomatis setelah 4 detik
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("toast" as any, handler);
    return () => window.removeEventListener("toast" as any, handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-5 py-4 bg-white border rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
            toast.type === "success" ? "border-emerald-100" : "border-red-100"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-medium text-slate-700">{toast.message}</span>
          <button
            onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))}
            className="ml-2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// Pastikan namanya showToast agar konsisten dengan panggilan di TaskForm
export const showToast = (message: string, type: "success" | "error" = "success") => {
  const event = new CustomEvent("toast", { detail: { message, type } });
  window.dispatchEvent(event);
};