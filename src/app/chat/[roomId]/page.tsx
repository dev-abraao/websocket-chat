import React from 'react';
import RoomPage from "./(components)/roomPage";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { decrypt } from '@/(lib)/session';

export default async function Room({ params }: { params: Promise<{ roomId: string }> }) {
  // Verificar se o usuário está logado
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    // Usuário não está logado, redireciona para a página de login
    redirect('/login');
  }
  
  // Decodificar a sessão para obter o userId
  const payload = await decrypt(session);
  const userId = payload?.userId;
  
  if (!userId) {
    // Sessão inválida
    redirect('/login');
  }
  
  const { roomId } = await params;
  
  return <RoomPage roomId={roomId} userId={String(userId)} />;
}
