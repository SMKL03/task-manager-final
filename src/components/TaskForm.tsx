"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createTask } from "@/actions/task-actions";
import { AlertCircle } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { showToast } from "@/components/ToastContainer";

export default function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  
  const [state, action, pending] = useActionState(createTask, { 
    errors: null, success: false 
  });

  const errors = state.errors as Record<string, string[]> | null;

  useEffect(() => {
    if (state.success) {
      showToast("Tugas baru berhasil ditambahkan!", "success");
      formRef.current?.reset();
      setAttachmentUrl(""); 
    }
    
    if (errors?._form) {
      showToast(errors._form[0], "error");
    }
  }, [state.success, errors]);
  
  return (
    <form ref={formRef} action={action} className="p-6 sm:p-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-2xl space-y-5">
      
      {/* Hidden input untuk menyimpan URL gambar dari Supabase */}
      <input type="hidden" name="attachmentUrl" value={attachmentUrl} />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Tugas</label>
          <input 
            name="title" 
            placeholder="Apa yang ingin Anda capai hari ini?" 
            className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
          />
          {errors?.title && (
            <p className="text-red-500 text-sm font-medium mt-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {errors.title[0]}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Singkat</label>
          <textarea 
            name="description" 
            placeholder="Tambahkan detail jika diperlukan..." 
            rows={2} 
            className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lampiran Gambar (Opsional)</label>
          <FileUpload onUpload={(url) => setAttachmentUrl(url)} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <div className="flex-1">
            <select name="priority" className="w-full h-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer">
              <option value="LOW">🔵 Low Priority</option>
              <option value="MEDIUM">🟡 Medium Priority</option>
              <option value="HIGH">🟠 High Priority</option>
              <option value="URGENT">🔴 Urgent!</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={pending} 
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {pending ? "Menyimpan..." : "Tambah Tugas"}
          </button>
        </div>
      </div>
    </form>
  );
}
