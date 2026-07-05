import { z } from 'zod';

// Mirrors the password rules enforced in apps/authentication/serializers.py
// (RegisterSerializer.validate_password) — kept in sync intentionally,
// so the user sees the same validation error client-side before
// ever hitting the network.
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((val) => /[A-Z]/.test(val), 'Must contain at least one uppercase letter')
  .refine((val) => /[a-z]/.test(val), 'Must contain at least one lowercase letter')
  .refine(
    (val) => /[0-9]/.test(val) || /[^a-zA-Z0-9]/.test(val),
    'Must contain at least one number or special character'
  );

export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: passwordSchema,
    confirm_password: z.string(),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;