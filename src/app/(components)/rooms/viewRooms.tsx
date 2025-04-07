"use client";

import { useEffect, useState } from "react";
import { getRooms } from "@/(actions)/room";
import { IRoom } from "@/(lib)/definitions";
import CreateRoomForm from "./createRoomForm";
import { MdRefresh, MdMenu, MdClose } from "react-icons/md";
import Link from "next/link";
import { format } from "date-fns";

export default function ViewRooms() {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const fetchRooms = () => {
    setLoading(true);
    setError(null);
    getRooms()
      .then((data: IRoom[]) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="md:hidden fixed z-20 top-[2rem] left-2 bg-[#7A80DA] text-white p-2 rounded-full shadow-lg"
        aria-label={isVisible ? "Fechar painel de salas" : "Abrir painel de salas"}
      >
        {isVisible ? <MdClose size={20} /> : <MdMenu size={20} />}
      </button>

      <div 
        className={`bg-[#F4F4F4] rounded w-64 border-r border-gray-200 fixed left-0 top-[4.8rem] sm:top-[4.2rem] bottom-0 flex flex-col z-10 transition-transform duration-300 ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold p-4">Salas</h1>
          <button
            onClick={fetchRooms}
            disabled={loading}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Atualizar salas"
          >
            <MdRefresh className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">Erro ao carregar as salas</div>
        ) : (
          <div className="p-2 overflow-y-auto flex-grow">
            {rooms.length === 0 ? (
              <p className="text-gray-500 text-center p-4">
                Nenhuma sala encontrada
              </p>
            ) : (
              rooms.map((room) => (
                <Link key={room.id} href={`/chat/${room.id}`}>
                  <div className="bg-white p-3 rounded-lg mb-2 shadow-sm hover:bg-gray-50 cursor-pointer transition">
                    <h2 className="text-md font-semibold truncate">
                      {room.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {room.description || "Sem descrição"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Criada em:{" "}
                      {format(new Date(room.created_at), "dd/MM/yyyy HH:mm:ss")}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
        <CreateRoomForm onRoomCreated={fetchRooms} />
      </div>
      
      {isVisible && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-0"
          onClick={() => setIsVisible(false)}
        />
      )}
    </>
  );
}
