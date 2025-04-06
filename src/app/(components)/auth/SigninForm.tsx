"use client";

import { signin } from "@/actions/auth";
import { useActionState } from "react";
import Link from "next/link";

export default function SigninForm() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Welcome */}
        <div className="w-full md:w-1/2 bg-[#7A80DA] text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao</h1>
          <h5 className="text-5xl py-5 px-10 text-center">ChatTalk!</h5>
          <p className="text-center text-sm mb-6">
            Não possui uma conta? <br />
            Registre-se agora mesmo.
          </p>
          <Link href="/">
            <button className="mt-4 w-full bg-white text-[#7A80DA] hover:bg-[hsl(236,56%,60%)] hover:text-white font-bold py-2 px-4 rounded-md transition">
              Registrar
            </button>
          </Link>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-2xl font-bold mb-6 text-center text-[#7A80DA]">
            Login
          </h1>

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
                placeholder="Insira seu e-mail"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A80DA]"
              />
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
                placeholder="Digite sua senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A80DA]"
              />
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.email}
                </p>
              )}
              {state?.errors?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={pending}
              type="submit"
              className="w-full bg-[#7A80DA] hover:bg-[hsl(236,56%,60%)] text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
