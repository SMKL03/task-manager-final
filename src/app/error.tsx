"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Aduuh, ada masalah teknis!</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        Sepertinya sistem sedang lelah. Pesan kesalahan: <br />
        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded mt-2 inline-block">
          {error.message || "Unknown Error"}
        </span>
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </button>
    </div>
  );
}