import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    name: z.string().min(3, "Nama pengguna harus minimal 3 karakter"),
    password: z.string().min(6, "Kata sandi harus minimal 6 karakter"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Kata sandi tidak boleh kosong"),
  }),
});

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(3, "Nama pengguna harus minimal 3 karakter")
        .optional(),
      email: z.string().email("Format email tidak valid").optional(),
      password: z
        .string()
        .min(6, "Kata sandi minimal 6 karakter")
        .optional()
        .or(z.literal("")), // Mengizinkan string kosong jika user tidak ingin ubah password
      preferredTags: z
        .array(z.string())
        .min(1, "Minimal satu tag preferensi harus dipilih jika ingin diubah")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "Setidaknya satu kolom (name, email, password, atau preferredTags) harus diisi",
    }),
});

export const preferenceValidation = z.object({
  body: z.object({
    tags: z
      .array(z.string())
      .min(1, "Minimal satu tag preferensi harus dipilih"),
  }),
});

export const likeValidation = z.object({
  body: z.object({
    placeId: z.string().min(1, "ID Tempat (placeId) wajib diisi"),
  }),
});
