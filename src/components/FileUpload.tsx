"use client";
import { useState } from "react";
import { Paperclip, CheckCircle2, Loader2 } from "lucide-react";

export function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      
      // Detektif: Baca balasan mentah dari server
      const text = await res.text(); 
      
      let data;
      try {
        data = JSON.parse(text); // Coba jadikan JSON
      } catch (err) {
        // Jika server hancur parah (mengembalikan HTML merah, bukan JSON)
        alert("🚨 SERVER CRASH PARAH:\n" + text.substring(0, 150));
        setUploading(false);
        return;
      }

      if (!res.ok) {
        // Ini akan mencetak alasan pasti kenapa API menolak file kita!
        alert("❌ DITOLAK SERVER:\n" + (data.error || "Alasan tidak diketahui"));
        setUploading(false);
        return;
      }

      if (data.url) {
        onUpload(data.url);
        setSuccess(true);
      }
    } catch (error: any) {
      alert("🌐 ERROR JARINGAN/KONEKSI:\n" + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full">
      <label className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
        success ? "border-emerald-200 bg-emerald-50 text-emerald-600" : 
        "border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-500 hover:text-indigo-600"
      }`}>
        
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : success ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Paperclip className="w-5 h-5" />
        )}
        
        <span className="font-medium text-sm">
          {uploading ? "Mengupload..." : success ? "File Terlampir!" : "Lampirkan File (Max 5MB)"}
        </span>
        
        <input type="file" className="hidden" onChange={handleChange} accept="image/*,.pdf" disabled={uploading} />
      </label>
    </div>
  );
}