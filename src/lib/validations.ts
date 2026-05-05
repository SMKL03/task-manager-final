import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi ya!").max(200, "Judul maksimal 200 karakter."),
  description: z.string().max(1000, "Deskripsi terlalu panjang.").optional().or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  attachmentUrl: z.string().optional().or(z.literal("")), // <-- TAMBAHKAN BARIS INI
});

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { 
      success: false as const, 
      errors: result.error.flatten().fieldErrors 
    };
  }
  return { success: true as const, data: result.data };
}