"use client";

import { useActionState } from "react";
import createRoom from "@/(actions)/room";
import { useTransition, useState } from "react";
import { RoomFormSchema } from "@/(lib)/definitions";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated?: () => void;
}

export default function CreateRoomModal({ 
  isOpen, 
  onClose, 
  onRoomCreated 
}: CreateRoomModalProps) {
  const [state, action, pending] = useActionState(createRoom, undefined);
  const [isPending, startTransition] = useTransition();
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const formValues = {
      name: formData.get('name') as string,
      description: formData.get('description') as string
    };
    
    const result = RoomFormSchema.safeParse(formValues);
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = String(issue.path[0]);
        formattedErrors[path] = issue.message;
      });
      
      setValidationErrors(formattedErrors);
      return;
    }
    
    setValidationErrors({});
    
    startTransition(() => {
      action(formData);
      if (onRoomCreated) {
        onRoomCreated();
      }
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Criar Nova Sala</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome da Sala
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Digite o nome da sala"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
            {state?.errors?.name && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Descreva o propósito da sala"
            ></textarea>
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.description}
              </p>
            )}
            {state?.errors?.description && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending || isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-[#7A80DA] hover:bg-[#5a62ce] focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending || isPending ? "Criando Sala..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
