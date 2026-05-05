"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

interface FilterBarProps {
  priority?: string;
  completed?: string;
}

export function FilterBar({ priority, completed }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    
    // Jika user memilih "ALL", kita hapus parameternya dari URL
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Wajib reset ke halaman 1 setiap kali filter diubah
    params.delete("page"); 
    
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      {/* Ikon Filter */}
      <div className="flex items-center gap-2 text-slate-400 w-full sm:w-auto px-1">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-semibold hidden lg:inline-block uppercase tracking-wider">Filter</span>
      </div>

      {/* Dropdown Prioritas */}
      <select
        value={priority || "ALL"}
        onChange={(e) => updateFilter("priority", e.target.value)}
        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] cursor-pointer hover:border-indigo-300 hover:bg-slate-50 transition-all"
      >
        <option value="ALL">Semua Prioritas</option>
        <option value="LOW">🔵 Low Priority</option>
        <option value="MEDIUM">🟡 Medium Priority</option>
        <option value="HIGH">🟠 High Priority</option>
        <option value="URGENT">🔴 Urgent!</option>
      </select>

      {/* Dropdown Status Selesai */}
      <select
        value={completed !== undefined ? completed : "ALL"}
        onChange={(e) => updateFilter("completed", e.target.value)}
        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] cursor-pointer hover:border-indigo-300 hover:bg-slate-50 transition-all"
      >
        <option value="ALL">Semua Status</option>
        <option value="true">✅ Selesai</option>
        <option value="false">⏳ Belum Selesai</option>
      </select>
    </div>
  );
}