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
    fetchName();
  }, []);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-[#7A80DA] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Trocar Nome
      </button>

      {showModal && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center">
          <div className="bg-white">
            <h2>Trocar Nome</h2>
            <form action={action}>
              <input type="text" name="username" id="username" />
              <button type="submit">Confirmar</button>
              <button onClick={openModal}>Cancelar</button>
              {state?.errors?.username && <p>{state.errors.username}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
