"use client";
import { fetchUsername } from "@/(actions)/user";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { updateUsername } from "@/(actions)/user";

export default function NameModal() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState<string | null | undefined>("");
  const [state, action, pending] = useActionState(updateUsername, undefined);

  const openModal = () => {
    setShowModal(!showModal);
  };

  const fetchName = () => {
    fetchUsername().then((data) => {
      setName(data);
    });
  };

  useEffect(() => {
    if (state?.data && state.data.success) {
      setShowModal(false);
      fetchName();
    }
    fetchName();
  }, [state]);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-[#7A80DA] hover:bg-[#5a62ce] text-white font-bold py-2 px-4 rounded-lg"
      >
        Trocar Nome
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-[#7A80DA] text-white p-4">
              <h2 className="text-xl font-semibold text-center">Trocar Nome</h2>
            </div>
            <form action={action} className="p-6">
              <p className="text-center text-gray-700 mb-4">
                Nome atual: <span className="font-medium">{name}</span>
              </p>
              <input
                type="text"
                name="username"
                id="username"
                placeholder={state?.errors?.username
                  ? "Não foi possível alterar o nome"
                  : "Digite seu novo nome"}
                className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[#7A80DA] transition-all
                ${state?.errors?.username ? 'border-red-500 text-red-500 placeholder-red-500' : 'border-gray-300'}`}
              />
              {state?.errors?.username && (
                <p className="mt-1 text-sm text-red-500">{state.errors.username}</p>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={openModal} 
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={pending}
                  className="bg-[#7A80DA] hover:bg-[#5a62ce] text-white font-medium px-4 py-2 rounded-lg transition-colors 
                  disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {pending ? "Enviando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
