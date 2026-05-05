// src/lib/storage.ts
import { createClient } from "@supabase/supabase-js";

// Mengaktifkan kurir dengan kunci rahasia
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from("attachments") // Nama "lemari" yang tadi kita buat
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // Meminta link publik agar bisa ditampilkan di layar
  const { data: urlData } = supabase.storage
    .from("attachments")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteFile(path: string) {
  await supabase.storage.from("attachments").remove([path]);
}