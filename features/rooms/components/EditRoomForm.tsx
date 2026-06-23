import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/AuthContext";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Room } from "../types";
import { updateRoom } from "../roomService";

interface EditRoomFormProps {
  room: Room;
  onUpdated: (room: Room) => void;
}

export function EditRoomForm({ room, onUpdated }: EditRoomFormProps) {
  const [name, setName] = useState(room.name);
  const [description, setDescription] = useState(room.description || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.id || !name.trim()) return;

    setIsSaving(true);
    try {
      await updateRoom(room.id, { name, description });
      onUpdated({ ...room, name, description });
      toast.success('Room updated successfully');
    } catch (error) {
      console.error("Failed to update room:", error);
      toast.error('Failed to update room');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-indigo-50 rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/20">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Room Details</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <Input
          id="room-name"
          label="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          id="room-description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          type="submit"
          className="mt-4 disabled:opacity-50 disabled:hover:translate-y-0"
          disabled={isSaving || !name.trim() || (name === room.name && description === (room.description || ""))}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
