import React from "react";
import { Plus } from "lucide-react";

interface RoomsHeaderProps {
  onCreateClick: () => void;
}

export function RoomsHeader({ onCreateClick }: RoomsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-16">
      <div>
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Meeting Rooms</h1>
        <p className="text-xl text-gray-500">Manage your workspaces and meeting areas.</p>
      </div>

      <button
        onClick={onCreateClick}
        className="flex items-center gap-3 bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5"
      >
        <Plus size={24} />
        Create Room
      </button>
    </div>
  );
}
