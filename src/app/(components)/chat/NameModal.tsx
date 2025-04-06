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
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center p-10 ">
          <div className="bg-white">
            <div className="flex justify-center bg-[#7A80DA] text-white p-3 w-[400px]">
              <h2 className="flex text-xl">Trocar Nome</h2>
            </div>
            <form action={action} className="flex flex-col">
              <p className="text-center mt-4 mb-2">
                Nome atual: {name}
              </p>
              <input
                type="text"
                name="username"
                id="username"
                placeholder={state?.errors?.username
                  ? "Não foi possível alterar o nome"
                  : "Digite seu novo nome"}
                className={`mx-auto rounded-lg shadow-lg border my-[50px] w-[300px] h-[30px] p-2
                ${state?.errors?.username ? 'border-red-500 placeholder-red-500' : 'border-3'}`}
              />
              <div className="flex justify-end gap-4 mb-2 mr-2">
                <button type="submit" className="bg-[#7A80DA] hover:bg-[#5a62ce] text-white font-bold py-1 px-2 rounded-lg">
                  Confirmar
                </button>
                <button onClick={openModal} className="bg-[#7A80DA] hover:bg-[#5a62ce] text-white font-bold py-1 px-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
