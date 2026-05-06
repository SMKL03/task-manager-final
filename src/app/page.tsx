import { FilterBar } from "@/components/FilterBar";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import TaskForm from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
// 1. Tambahkan import untuk LogoutButton
import { LogoutButton } from "@/components/LogoutButton";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    priority?: string;
    completed?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  // 1. Dapatkan user yang sedang login
  const user = await requireAuth();

  // 2. Ambil parameter dari URL
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 5; // Kita buat 5 dulu agar fitur halamannya cepat terlihat!

  // 3. Bangun query untuk Prisma
  const where = {
    userId: user.id, // WAJIB: Hanya ambil tugas milik user ini!
    ...(params.search && {
      OR: [
        { title: { contains: params.search, mode: "insensitive" as const } },
        { description: { contains: params.search, mode: "insensitive" as const } },
      ],
    }),
    ...(params.priority && { priority: params.priority }),
    ...(params.priority && { priority: params.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT" }),
  };

  // 4. Ambil data tugas & total jumlah tugas secara paralel (Lebih Cepat!)
  const [tasks, totalTasks] = await Promise.all([
    db.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.task.count({ where }),
  ]);

  const totalPages = Math.ceil(totalTasks / perPage);

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Header Info & Tombol Logout */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Workspace</h1>
          <p className="text-slate-500 mt-1">Ditemukan {totalTasks} tugas yang sesuai.</p>
        </div>
        
        {/* Tombol Logout 1-Klik menggantikan tag <a> yang lama */}
        <LogoutButton />
      </div>

      <div className="w-full h-px bg-slate-100 mb-8" />

      {/* Form Tambah Tugas */}
      <TaskForm />

      <div className="w-full h-px bg-slate-100 my-10" />

      {/* Area Navigasi (Search & Filter) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-slate-800 w-full sm:w-auto">Daftar Tugas</h2>
        <div className="w-full sm:w-auto flex gap-3">
          <SearchBar defaultValue={params.search} />
          <FilterBar priority={params.priority} completed={params.completed} />
        </div>
      </div>

      {/* Daftar Tugas & Paginasi */}
      <div className="bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-100">
        <TaskList tasks={tasks} />
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </main>
  );
}