import HandleName from "@/(handlers)/HandleName";
import React, { useEffect, useState } from "react";

interface InputNameProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputName({ name, setName }: InputNameProps) {
  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    setHasName(!!savedName);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    HandleName(e, name);
    setHasName(true);
  };

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("name");
    setHasName(false);
  };

  return hasName ? (
    <form onSubmit={handleLogout} className="m-4">
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
        Sair
      </button>
    </form>
  ) : (
    <div>
      <form onSubmit={handleSubmit} className="flex m-4">
        <p className="text-gray-700 mb-2 p-2">Nome</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
}
