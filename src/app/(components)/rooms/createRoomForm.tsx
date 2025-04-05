import { useActionState } from "react";
import createRoom from "./room";

export default async function CreateRoomForm() {
  const [state, action, pending] = useActionState(createRoom, undefined);

  return (
    <>
      <form action={action}>
        <label htmlFor="name"></label>
        <input type="text" name="name" id="name" />
        {state?.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
        <button type="submit">
          {pending ? "Criando Sala..." : "Criar Sala"}
        </button>
      </form>
    </>
  );
}
