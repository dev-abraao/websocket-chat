"use client";
import { useEffect, useState } from "react";
import { getDefaultRoomId } from "@/(actions)/room";
import { useRouter } from "next/navigation";
import { MdRefresh } from "react-icons/md";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const redirectToDefaultRoom = async () => {
      try {
        const defaultRoomId = await getDefaultRoomId();
        router.replace(`/chat/${defaultRoomId}`);
      } catch (error) {
        console.error("Error fetching default room:", error);
        setLoading(false);
      }
    };

    redirectToDefaultRoom();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="mb-4">Falha ao carregar a sala</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
