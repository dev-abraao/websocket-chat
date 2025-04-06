"use client";

import { useEffect, useState } from "react";
import { getRooms } from "@/(actions)/room";
import { IRoom } from "@/(lib)/definitions";
import CreateRoomForm from "./createRoomForm";
import { MdRefresh } from "react-icons/md";
import Link from "next/link";
import { format } from 'date-fns';

export default function ViewRooms() {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="bg-[#F4F4F4] h-screen w-64 border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
      <CreateRoomForm onRoomCreated={fetchRooms} />
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
        <div className="p-2">
          {rooms.length === 0 ? (
            <p className="text-gray-500 text-center p-4">
              Nenhuma sala encontrada
            </p>
          ) : (
            rooms.map((room) => (
              <Link key={room.id} href={`/chat/${room.id}`}>
                <div
                  className="bg-white p-3 rounded-lg mb-2 shadow-sm hover:bg-gray-50 cursor-pointer transition"
                >
                  <h2 className="text-md font-semibold truncate">
                    {room.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Criada em: {format(new Date(room.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
