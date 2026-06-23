import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-lg rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl duration-200">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100/50 p-2 text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
