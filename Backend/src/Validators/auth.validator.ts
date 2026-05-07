import { z } from 'zod';

export const ZRegisterUser = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(3, 'Display Name must be at least 3 characters')
    .max(50, 'Display name cannot exceed 50 characters')
    .trim(),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain uppercase, lowercase, special characters',
    ),
});

export const ZLoginUser = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(1, 'Password cannot be empty'),
});

export type RegisterUserDTO = z.infer<typeof ZRegisterUser>;
export type LoginUserDTO = z.infer<typeof ZLoginUser>;
