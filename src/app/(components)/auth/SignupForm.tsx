'use client'
 
import { signup } from '@/actions/auth'
import { useActionState } from 'react'
 
export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

 
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
      
      {state?.message && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {state.message}
        </div>
      )}
      
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email"
            placeholder="Email" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>
 
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
          <input 
            id="username" 
            name="username" 
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          {state?.errors?.username && (
            <p className="mt-1 text-sm text-red-600">{state.errors.username[0]}</p>
          )}
        </div>
 
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input 
            id="password" 
            name="password" 
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          {state?.errors?.password && (
            <div className="mt-1 text-sm text-red-600">
              <p>Password must:</p>
              <ul className="list-disc pl-5">
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button 
          disabled={pending} 
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {pending ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  )
}