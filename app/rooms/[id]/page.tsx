"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { deleteRoom } from "@/features/rooms/roomService";
import { Spinner } from "@/components/ui/Spinner";
import { EditRoomForm } from "@/features/rooms/components/EditRoomForm";
import { MembersList } from "@/features/rooms/components/MembersList";
import { DeleteRoomModal } from "@/features/rooms/components/DeleteRoomModal";
import toast from "react-hot-toast";
import { useRoom } from "@/hooks/useRoom";
import { BackLink } from "@/components/ui/BackLink";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const roomId = params.id as string;
  const { room, loading: isLoadingRoom, error: hookError } = useRoom(roomId);

  let displayError = hookError ? "Something went wrong" : "";
  if (!isLoadingRoom && !room && !displayError) {
    displayError = "Room not found";
  } else if (room && user?.email && !room.members[user.email]) {
    displayError = "You do not have access to this room";
  }

  const handleDeleteConfirm = async () => {
    if (!room?.id) return;
    setIsDeleting(true);
    try {
      await deleteRoom(room.id);
      toast.success("Room deleted successfully");
      router.push("/rooms");
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoadingRoom) {
    return <Spinner size="lg" className="py-24" />;
  }

  if (displayError || !room || !user?.email) {
    return (
      <div className="py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          {displayError || "Access Denied"}
        </h2>
        <Link
          href="/rooms"
          className="text-xl font-semibold text-indigo-600 hover:text-indigo-700"
        >
          &larr; Back to Rooms
        </Link>
      </div>
    );
  }

  const role = room.members[user.email];
  const canManage = role === "owner" || role === "admin";

  return (
    <div className="pb-20">
      <BackLink href="/rooms" label="Back to Rooms" />

      <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div>
          <h1 className="mb-3 text-5xl font-bold text-gray-900">{room.name}</h1>
          <p className="text-xl text-gray-500">
            Manage room details and participants.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-red-50 px-6 py-4 font-bold text-red-600 transition-all hover:scale-105 hover:bg-red-100"
          >
            <Trash2 size={20} />
            Delete Room
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {canManage ? (
          <div>
            <EditRoomForm room={room} onUpdated={() => {}} />
          </div>
        ) : (
          <div className="flex h-full min-h-75 flex-col items-center justify-center rounded-[2.5rem] border border-indigo-50 bg-white/70 p-10 text-center shadow-xl shadow-indigo-100/20 backdrop-blur-xl">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              About this room
            </h3>
            <p className="max-w-md text-xl leading-relaxed text-gray-500">
              {room.description || "No description provided."}
            </p>
          </div>
        )}

        <div>
          <MembersList room={room} canManage={canManage} onUpdated={() => {}} />
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
