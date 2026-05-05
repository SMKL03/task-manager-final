"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TaskSchema, validateInput } from "@/lib/validations";
import { requireAuth } from "@/lib/auth-helpers";

// 1. Fungsi Create
export async function createTask(prevState: any, formData: FormData) {
  try {
    const user = await requireAuth();

    // Trik Aman: Tangkap link gambar, kalau kosong jadikan 'undefined' agar satpam tidak marah
    const rawAttachment = formData.get("attachmentUrl");
    const safeAttachmentUrl = rawAttachment && rawAttachment !== "" ? String(rawAttachment) : undefined;

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      attachmentUrl: safeAttachmentUrl, 
    };

    const validation = validateInput(TaskSchema, rawData);
    
    // Jika satpam menolak, kembalikan errornya ke layar
    if (!validation.success) {
      console.log("Error Validasi:", validation.errors);
      return { errors: validation.errors, success: false };
    }

    // Simpan ke database
    await db.task.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        priority: validation.data.priority,
        attachmentUrl: validation.data.attachmentUrl || null, // Pastikan jadi null kalau tidak ada gambar
        userId: user.id, 
      },
    });
    
    revalidatePath("/");
    return { success: true, errors: null };
    
  } catch (error) {
    console.error("Gagal menyimpan ke Database:", error); // Munculkan error merah di terminal VS Code
    return { success: false, errors: { _form: ["Terjadi kesalahan saat menyimpan ke database!"] } };
  }
}

// 2. Fungsi Toggle (Centang)
export async function toggleTask(id: string) {
  const user = await requireAuth();
  const task = await db.task.findUnique({ where: { id } });
  if (!task || task.userId !== user.id) return; 
  await db.task.update({ where: { id }, data: { completed: !task.completed } });
  revalidatePath("/");
}

// 3. Fungsi Delete (Hapus)
export async function deleteTask(id: string) {
  const user = await requireAuth();
  await db.task.deleteMany({ where: { id: id, userId: user.id } });
  revalidatePath("/");
}

// 4. Fungsi Update (Edit)
export async function updateTask(id: string, data: { title: string; description: string; priority: string }) {
  const user = await requireAuth();
  await db.task.updateMany({ where: { id: id, userId: user.id }, data });
  revalidatePath("/");
}