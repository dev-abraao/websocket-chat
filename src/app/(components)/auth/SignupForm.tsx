"use client";

import { signup } from "@/actions/auth";
import { useActionState } from "react";
import Link from "next/link";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Welcome */}
        <div className="w-full md:w-1/2 bg-[#7A80DA] text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao</h1>
          <h5 className="text-5xl py-5 px-10 text-center cursor-default">
            ChatTalk!
          </h5>
          <p className="text-center text-sm mb-6">
            Já possui uma conta? <br />
            Faça login para continuar.
          </p>
          <Link href="/login">
            <button className="mt-4 w-full bg-white text-[#7A80DA] hover:bg-[hsl(236,56%,60%)] hover:text-white font-bold py-2 px-4 rounded-md transition">
              Login
            </button>
          </Link>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-2xl font-bold mb-6 text-center text-[#7A80DA]">
            Registro
          </h1>

          {state?.message && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Insira o e-mail da sua conta"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A80DA]"
              />
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usuário
              </label>
              <input
                id="username"
                name="username"
                placeholder="Crie seu nome de exibição"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A80DA]"
              />
              {state?.errors?.username && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.username[0]}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Crie sua senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A80DA]"
              />
              {state?.errors?.password && (
                <div className="mt-1 text-sm text-red-600">
                  <p>A senha deve conter:</p>
                  <ul className="list-disc pl-5">
                    {state.errors.password.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={pending}
              type="submit"
              className="w-full bg-[#7A80DA] hover:bg-[hsl(236,56%,60%)] text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {pending ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
