import React from "react";
import { Room } from "../types";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RoomCardProps {
  room: Room;
  userEmail: string | null;
  onDeleteClick: (room: Room) => void;
}

export function RoomCard({ room, userEmail, onDeleteClick }: RoomCardProps) {
  const router = useRouter();
  const role = userEmail ? room.members[userEmail] : "";
  const canManage = role === "owner" || role === "admin";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick(room);
  };

  const handleCardClick = () => {
    if (room.id) {
      router.push(`/rooms/${room.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex min-h-[280px] cursor-pointer flex-col items-center overflow-hidden rounded-[2.5rem] border border-indigo-50 bg-white p-10 text-center shadow-2xl shadow-indigo-200/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_35px_60px_-15px_rgba(79,70,229,0.4)]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      <div className="relative z-10 flex h-full w-full flex-col items-center pt-4">
        <h3 className="mb-5 text-4xl font-extrabold text-gray-900 transition-colors group-hover:text-indigo-600">
          {room.name}
        </h3>

        <p className="mb-6 line-clamp-3 grow px-4 text-xl leading-relaxed text-gray-500">
          {room.description || "No description provided."}
        </p>

        {canManage && (
          <div className="mb-6 flex translate-y-2 transform items-center justify-center gap-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleDeleteClick}
              className="rounded-2xl bg-red-50 p-3.5 text-red-500 shadow-sm transition-all hover:scale-110 hover:bg-red-100 hover:text-red-700 hover:shadow-md"
              title="Delete room"
            >
              <Trash2 size={22} />
            </button>
          </div>
        )}

        <div className="mt-auto flex w-full flex-col items-center gap-4 border-t border-gray-100/80 pt-8">
          <span className="rounded-full border border-indigo-100/50 bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-3 text-base font-bold tracking-widest text-indigo-700 uppercase shadow-sm">
            {role}
          </span>
          <span className="text-base font-medium text-gray-400">
            Created {new Date(room.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
