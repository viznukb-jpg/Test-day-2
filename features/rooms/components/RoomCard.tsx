import React from "react";
import { Room } from "../types";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RoomCardProps {
  room: Room;
  userEmail: string | null;
  onDeleteClick: (room: Room) => void;
}

export function RoomCard({ room, userEmail, onDeleteClick }: RoomCardProps) {
  const router = useRouter();
  // Use a fallback to prevent TS error when userEmail is null (ts 2538)
  const role = userEmail ? room.members[userEmail] : "guest";
  const canManage = role === "owner" || role === "admin";

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (room.id) {
      router.push(`/rooms/${room.id}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick(room);
  };

  return (
    <div className="bg-white backdrop-blur-xl border border-indigo-50 rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/30 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-200 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col items-center text-center min-h-[280px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 flex flex-col items-center h-full w-full pt-4">
        <h3 className="text-4xl font-extrabold text-gray-900 mb-5 group-hover:text-indigo-600 transition-colors">
          {room.name}
        </h3>

        <p className="text-gray-500 text-xl mb-6 line-clamp-3 flex-grow leading-relaxed px-4">
          {room.description || "No description provided."}
        </p>

        {canManage && (
          <div className="flex items-center justify-center gap-4 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleEditClick}
              className="p-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-110"
              title="Edit room"
            >
              <Pencil size={22} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-3.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-110"
              title="Delete room"
            >
              <Trash2 size={22} />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 w-full mt-auto pt-8 border-t border-gray-100/80">
          <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-8 py-3 rounded-full text-base font-bold tracking-widest uppercase shadow-sm border border-indigo-100/50">
            {role}
          </span>
          <span className="text-gray-400 text-base font-medium">
            Created {new Date(room.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
