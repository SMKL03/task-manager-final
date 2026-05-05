"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Trash2, Edit2, Paperclip } from "lucide-react";
import { toggleTask } from "@/actions/task-actions";
import { EditTaskModal } from "./EditTaskModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
// 1. IMPORT TOAST DI SINI
import { showToast } from "@/components/ToastContainer";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  attachmentUrl: string | null; 
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
        <p className="text-slate-500 font-medium">Belum ada tugas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className={`flex gap-4 p-5 bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-2xl group transition-all duration-300 hover:shadow-md hover:border-indigo-100 ${task.completed ? "opacity-70 bg-slate-50/50" : ""}`}>
          
          {/* Tombol Centang - DITAMBAHKAN FUNGSI TOAST */}
          <button
            onClick={async () => {
              try {
                await toggleTask(task.id);
                // Menampilkan toast sesuai status barunya
                showToast(
                  task.completed ? "Tugas dikembalikan (Belum Selesai)" : "Mantap, tugas selesai! 🎉", 
                  "success"
                );
              } catch (error) {
                showToast("Gagal memperbarui status tugas.", "error");
              }
            }}
            disabled={isPending}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-indigo-500" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          {/* Konten Tugas */}
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-lg transition-all ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* --- KODE LAMPIRAN GAMBAR/FILE --- */}
            {task.attachmentUrl && (
              <div className="mt-4">
                {task.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                  <div className="relative group/img overflow-hidden rounded-xl border border-slate-200 inline-block">
                    <img src={task.attachmentUrl} alt="Lampiran Tugas" className="max-h-32 w-auto object-cover transition-transform group-hover/img:scale-105" />
                    <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">Lihat Penuh</span>
                    </a>
                  </div>
                ) : (
                  <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                    <Paperclip className="w-4 h-4" />
                    Lihat Lampiran Dokumen
                  </a>
                )}
              </div>
            )}

            {/* Label Prioritas */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider
                ${task.priority === "URGENT" ? "bg-red-50 text-red-600 border border-red-100" :
                  task.priority === "HIGH" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                  task.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                  "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Tombol Edit & Hapus (Membuka Modal) */}
          <div className="flex flex-col sm:flex-row gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setEditingTask(task)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setDeletingTask(task)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      ))}

      {/* Render Modal jika tombol di atas ditekan */}
      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} />
      )}
      {deletingTask && (
        <DeleteConfirmModal task={deletingTask} onClose={() => setDeletingTask(null)} />
      )}
    </div>
  );
}