import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Fungsi praktis: Panggil ini jika halaman/aksi WAJIB login
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  return session.user;
}