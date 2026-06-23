"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { CreateRoomModal } from "@/features/rooms/components/CreateRoomModal";
import { deleteRoom } from "@/features/rooms/roomService";
import { Room } from "@/features/rooms/types";
import { useRooms } from "@/hooks/useRooms";

import { Spinner } from "@/components/ui/Spinner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus } from "lucide-react";
import { RoomsEmptyState } from "@/features/rooms/components/RoomsEmptyState";
import { RoomCard } from "@/features/rooms/components/RoomCard";
import { DeleteRoomModal } from "@/features/rooms/components/DeleteRoomModal";

export default function RoomsPage() {
  const { user, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { rooms, loading: isLoadingRooms } = useRooms(user?.email);

  const handleDeleteConfirm = async () => {
    if (!roomToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteRoom(roomToDelete.id);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Failed to delete room:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || !user) {
    return <Spinner size="lg" className="py-24" />;
  }

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto pb-20">
      <PageHeader
        title="Meeting Rooms"
        description="Manage your workspaces and meeting areas."
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5"
          >
            <Plus size={24} />
            Create Room
          </button>
        }
      />

      {isLoadingRooms ? (
        <Spinner size="lg" className="py-24" />
      ) : rooms.length === 0 ? (
        <RoomsEmptyState onCreateClick={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              userEmail={user.email}
              onDeleteClick={(r) => setRoomToDelete(r)}
            />
          ))}
        </div>
      )}

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />

      <DeleteRoomModal
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        roomName={roomToDelete?.name || ""}
      />
    </main>
  );
}
