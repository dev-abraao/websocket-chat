'use server'

import { SignupFormSchema, FormState } from '@/(lib)/definitions'
import bcrypt from 'bcryptjs'
import { prisma } from '@/../../prisma/prisma'
 
export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { email, username, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        login: email,
        username: username,
        password: hashedPassword,
      },
    })
    
    if (!user) {
      return {
        message: 'An error occurred while creating your account.',
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      message: `Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}