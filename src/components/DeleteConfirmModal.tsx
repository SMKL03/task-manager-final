"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { deleteTask } from "@/actions/task-actions";
import { useState } from "react";
// 1. Import fungsi Toast di sini
import { showToast } from "@/components/ToastContainer";

export function DeleteConfirmModal({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      // 2. Panggil toast sukses setelah data berhasil dihapus
      showToast("Tugas berhasil dihapus!", "success");
      onClose();
    } catch (error) {
      // 3. Panggil toast error jika database sedang bermasalah
      showToast("Gagal menghapus tugas.", "error");
      setIsDeleting(false); // Kembalikan tombol agar bisa dipencet lagi
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Hapus Tugas?</h3>
        <p className="text-slate-500 text-center mb-8">
          Tugas ini akan dihapus secara permanen dan tidak dapat dikembalikan.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isDeleting}
            className="flex-1 px-4 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition-all">
            Batal
          </button>
          <button onClick={handleDelete} disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-md shadow-red-500/20">
            {isDeleting ? "Menghapus..." : <><Trash2 className="w-4 h-4" /> Hapus</>}
          </button>
        </div>
      </div>
    </div>
  );
}