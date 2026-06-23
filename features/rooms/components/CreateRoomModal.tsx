import toast from "react-hot-toast";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema, CreateRoomFormValues } from "../validations";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formStyles } from "@/components/ui/formStyles";
import { createRoom } from "../roomService";
import { useAuth } from "@/features/auth/AuthContext";

import { Room } from "@/features/rooms/types";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (room: Room) => void;
}

export function CreateRoomModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoomModalProps) {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateRoomFormValues) => {
    if (!user?.email) return;
    setError("");
    try {
      const newRoom = await createRoom(
        data.name,
        data.description || "",
        user.email,
      );
      reset();
      onSuccess(newRoom as Room);
      toast.success('Room created successfully');
      onClose();
    } catch (err: any) {
      console.error("Failed to create room:", err);
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Room">
      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="name"
          label="Room Name"
          placeholder="e.g. Boardroom A"
          error={errors.name?.message}
          {...register("name")}
        />

        <Textarea
          id="description"
          label="Description (Optional)"
          placeholder="e.g. A spacious room with a whiteboard and projector."
          error={errors.description?.message}
          {...register("description")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={formStyles.button}
        >
          {isSubmitting ? "Creating..." : "Create Room"}
        </button>
      </form>
    </Modal>
  );
}
