import { z } from "zod";

export const SignupFormSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido." }),
  username: z.string().min(1, { message: "Insira um nome de exibição." }),
  password: z
    .string()
    .min(8, { message: "Ter pelo menos oito caractéres" })
    .regex(/[a-zA-Z]/, { message: "Conter pelo menos uma letra." })
    .regex(/[0-9]/, { message: "Conter pelo menos um número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Conter pelo menos um caractér especial (@, !, #).",
    })
    .trim(),
});

export const SignInSchema = z.object({
  email: z.string().email({ message: "Por favor insira um e-mail válido" }),
  password: z.string().min(8, { message: "Mínimo de oito caractéres" }),
});

export const FormSchema = z.object({
  name: z.string().min(1, { message: "Insira um nome de sala." }),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        username?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type SignFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type RoomFormState =
  | {
      errors?: {
        name?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};
