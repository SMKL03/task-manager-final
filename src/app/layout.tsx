import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ToastContainer"; // Import Toast kita

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager | Said Muzaki",
  description: "Aplikasi manajemen tugas profesional",
};

// Pastikan ini adalah EXPORT DEFAULT
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {/* ToastContainer diletakkan di sini agar muncul di atas semua komponen lain */}
        <ToastContainer />
        
        {children}
      </body>
    </html>
  );
}