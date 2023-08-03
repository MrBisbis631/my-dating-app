import { z } from "zod";

export const updateUsersSchema = z.object({
  firstName: z.string().min(2, "first name too short").max(50, "first name too long"),
  lastName: z.string().min(2, "last name too short").max(50, "last name too long"),
  email: z.string().email("invalid email address"),
  phoneNumber: z.string().regex(/d*/).min(10, "phone number too short").max(10, "phone number too long"),
});

export const partialUpdateUsersSchema = updateUsersSchema.partial();

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(8, "password too short").max(50, "password too long"),
  newPassword: z.string().min(8, "password too short").max(50, "password too long"),
  confirmPassword: z.string().min(8, "password too short").max(50, "password too long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "passwords do not match",
  path: ["confirmPassword", "newPassword"],
});
