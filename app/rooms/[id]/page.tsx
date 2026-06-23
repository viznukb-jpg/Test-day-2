"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { getRoomById, deleteRoom } from "@/features/rooms/roomService";
import { Room } from "@/features/rooms/types";
import { Spinner } from "@/components/ui/Spinner";
import { EditRoomForm } from "@/features/rooms/components/EditRoomForm";
import { MembersList } from "@/features/rooms/components/MembersList";
import { DeleteRoomModal } from "@/features/rooms/components/DeleteRoomModal";
import toast from "react-hot-toast";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const roomId = params.id as string;

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId || !user?.email) return;
      try {
        const data = await getRoomById(roomId);
        if (!data) {
          setError("Room not found");
          return;
        }
        
        // Check if user is a member
        if (!data.members[user.email]) {
          setError("You do not have access to this room");
          return;
        }

        setRoom(data);
      } catch (err) {
        console.error("Failed to fetch room:", err);
        setError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email && !authLoading) {
      fetchRoom();
    }
  }, [roomId, user, authLoading]);

  const handleDeleteConfirm = async () => {
    if (!room?.id) return;
    setIsDeleting(true);
    try {
      await deleteRoom(room.id);
      toast.success('Room deleted successfully');
      router.push("/rooms");
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error('Failed to delete room');
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoading) {
    return <Spinner size="lg" className="py-24" />;
  }

  if (error || !room || !user?.email) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{error || "Access Denied"}</h2>
        <Link href="/rooms" className="text-indigo-600 hover:text-indigo-700 font-semibold text-xl">
          &larr; Back to Rooms
        </Link>
      </div>
    );
  }

  const role = room.members[user.email];
  const canManage = role === "owner" || role === "admin";

  return (
    <div className="pb-20">
      <Link href="/rooms" className="inline-flex items-center gap-3 text-gray-500 hover:text-indigo-600 font-semibold text-2xl mb-10 transition-colors">
        <ArrowLeft size={28} />
        Back to Rooms
      </Link>

      <div className="mb-16 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">{room.name}</h1>
          <p className="text-xl text-gray-500">Manage room details and participants.</p>
        </div>
        
        {canManage && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold transition-all hover:scale-105"
          >
            <Trash2 size={20} />
            Delete Room
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {canManage ? (
          <div>
            <EditRoomForm room={room} onUpdated={(updatedRoom) => setRoom(updatedRoom)} />
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl border border-indigo-50 rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/20 flex flex-col justify-center items-center text-center h-full min-h-[300px]">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About this room</h3>
            <p className="text-gray-500 text-xl leading-relaxed max-w-md">
              {room.description || "No description provided."}
            </p>
          </div>
        )}
        
        <div>
          <MembersList room={room} canManage={canManage} onUpdated={(updatedRoom) => setRoom(updatedRoom)} />
        </div>
      </div>

      <DeleteRoomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        roomName={room.name}
      />
    </div>
  );
}
