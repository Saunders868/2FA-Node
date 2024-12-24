import { z } from "zod";

export const verifyMFASchema = z.object({
  code: z.string().trim().min(1).max(6),
  secretKey: z.string().trim().min(1),
});

export const verifyMFAforLoginSchema = z.object({
  code: z.string().trim().min(1).max(6),
  email: z.string().trim().email().min(1),
  userAgent: z.string().optional(),
});