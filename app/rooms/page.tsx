"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { CreateRoomModal } from "@/features/rooms/components/CreateRoomModal";
import { getUserRooms, deleteRoom } from "@/features/rooms/roomService";
import { Room } from "@/features/rooms/types";

import { Spinner } from "@/components/ui/Spinner";
import { RoomsHeader } from "@/features/rooms/components/RoomsHeader";
import { RoomsEmptyState } from "@/features/rooms/components/RoomsEmptyState";
import { RoomCard } from "@/features/rooms/components/RoomCard";
import { DeleteRoomModal } from "@/features/rooms/components/DeleteRoomModal";

export default function RoomsPage() {
  const { user, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user?.email) return;
      try {
        const data = await getUserRooms(user.email);
        setRooms(data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    if (user?.email) {
      fetchRooms();
    }
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!roomToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteRoom(roomToDelete.id);
      setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
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
    <div className="pb-20">
      <RoomsHeader onCreateClick={() => setIsModalOpen(true)} />

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
        onSuccess={(newRoom) => setRooms((prev) => [newRoom, ...prev])}
      />

      <DeleteRoomModal
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        roomName={roomToDelete?.name || ""}
      />
    </div>
  );
}
