
import React from 'react';
import RoomPage from "./(components)/roomPage";

export default async function Room({ params }: { params: Promise<{ roomId: string }> }) {
  const unwrappedParams = await params;
  const { roomId } = unwrappedParams;
  
  return <RoomPage roomId={roomId} />;
}
