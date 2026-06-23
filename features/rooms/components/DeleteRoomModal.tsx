import React from "react";
import { Modal } from "@/components/ui/Modal";

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  roomName: string;
}

export function DeleteRoomModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  roomName,
}: DeleteRoomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Room">
      <div className="space-y-10">
        <p className="text-2xl text-gray-600 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-gray-900">"{roomName}"</span>? 
          This action cannot be undone. All bookings and data associated with this room will be permanently lost.
        </p>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-5 rounded-full text-xl font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-5 rounded-full text-xl font-bold shadow-xl shadow-red-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
