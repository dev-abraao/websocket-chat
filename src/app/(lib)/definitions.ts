import { z } from 'zod'
 
export const SignupFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  username: z.string({ message: 'Please enter a valid username.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export const SignInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
})
 
export type FormState =
  | {
      errors?: {
        email?: string[]
        username?: string[]
        password?: string[]
      }
      message?: string
      success?: boolean
    }
  | undefined

  export type SignFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
      success?: boolean
    }
  | undefined

export type SessionPayload =
  {
    userId: string,
    expiresAt: Date
  }