"use client";

import { useState } from "react";
import CreateRoomModal from "./createRoomModal";

interface CreateRoomFormProps {
  onRoomCreated?: () => void;
}

export default function CreateRoomForm({ onRoomCreated }: CreateRoomFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-[#7A80DA] hover:bg-[#5a62ce] text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Criar Sala
      </button>

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRoomCreated={onRoomCreated}
      />
    </>
  );
}
