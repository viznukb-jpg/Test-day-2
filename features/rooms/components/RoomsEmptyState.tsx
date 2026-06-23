import React from "react";
import { Plus } from "lucide-react";

interface RoomsEmptyStateProps {
  onCreateClick: () => void;
}

export function RoomsEmptyState({ onCreateClick }: RoomsEmptyStateProps) {
  return (
    <div className="bg-white/50 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-20 text-center shadow-sm">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <Plus size={40} />
      </div>
      <h3 className="text-4xl font-bold text-gray-900 mb-4">No rooms found</h3>
      <p className="text-gray-500 text-xl max-w-md mx-auto mb-10">
        You don't have any meeting rooms yet. Create your first one to get started.
      </p>
      <button
        onClick={onCreateClick}
        className="text-xl font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-10 py-5 rounded-full transition-colors"
      >
        Create your first room
      </button>
    </div>
  );
}
