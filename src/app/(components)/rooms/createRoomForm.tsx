"use client";

import { useActionState } from "react";
import createRoom from "@/(actions)/room";
import { useTransition } from "react";

interface CreateRoomFormProps {
  onRoomCreated?: () => void;
}

export default function CreateRoomForm({ onRoomCreated }: CreateRoomFormProps) {
  const [state, action, pending] = useActionState(createRoom, undefined);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(() => {
      action(formData);
      if (onRoomCreated) {
        onRoomCreated();
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name"></label>
        <input type="text" name="name" id="name" />
        {state?.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
        <button type="submit" disabled={pending || isPending}>
          {pending || isPending ? "Criando Sala..." : "Criar Sala"}
        </button>
      </form>
    </>
  );
}
