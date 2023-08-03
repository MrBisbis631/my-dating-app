import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().regex(/^(ADMIN|MATCHMAKER|CLIENT)$/),
});

export const userSignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be 2 characters at least")
    .max(50, "First name must be 50 characters at most"),
  lastName: z
    .string()
    .min(2, "Last name must be 2 characters at least")
    .max(50, "Last name must be 50 characters at most"),
  phoneNumber: z
    .string()
    .min(10)
    .refine((value) => {
      return /^\d+$/.test(value);
    }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
  role: z.string().regex(/^(ADMIN|MATCHMAKER|CLIENT)$/),
});

const withConfirmPassword = z.object({
  confirmPassword: z.string().min(6, "Password must be 6 characters at least"),
  password: z.string().min(6, "Password must be 6 characters at least"),
}).refine((data) => {
  return data.password === data.confirmPassword;
},{message: "Passwords do not match", path: ["confirmPassword"]});

export const signUpMatchMakerSchema = userSignUpSchema.extend({
  role: z.string().regex(/^(MATCHMAKER)$/),
});

export const signUpClientSchema = userSignUpSchema.extend({
  gender: z.string().regex(/^(MALE|FEMALE)$/),
  birthday: z.string().refine((value) => {
    return !isNaN(Date.parse(value));
  }),
  category: z.string().regex(/^(SINGLE|DIVORCED)$/),
  aboutMe: z
    .string()
    .min(50, "About me must be 50 characters at least")
    .max(1000, "About me must be 1000 characters at most"),
  role: z.string().regex(/^(CLIENT)$/),
});
