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
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
        Trocar Nome
      </button>
    </form>
  ) : (
    <div>
      <form onSubmit={handleSubmit} className="flex  m-4 items-center gap-4">
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
          className="w-full border border-gray-300 rounded-lg px-3 p-[7] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-[#7A80DA] hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
}
