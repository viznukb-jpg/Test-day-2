import React, { useState } from "react";
import { Room } from "../types";
import { updateRoom } from "../roomService";
import { Input } from "@/components/ui/Input";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserPlus, Shield, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/AuthContext";

interface MembersListProps {
  room: Room;
  canManage: boolean;
  onUpdated: (room: Room) => void;
}

export function MembersList({ room, canManage, onUpdated }: MembersListProps) {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.id || !newEmail.trim()) return;
    const emailLower = newEmail.toLowerCase();
    if (user?.email && emailLower === user.email) {
      toast.error("You cannot add yourself as a member");
      return;
    }
    setIsAdding(true);
    try {
      const userDocRef = doc(db, "users", emailLower);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        toast.error("This user is not registered in the app");
        setIsAdding(false);
        return;
      }

      const updatedMembers = { ...room.members, [emailLower]: newRole };
      await updateRoom(room.id, { members: updatedMembers });
      onUpdated({ ...room, members: updatedMembers });
      toast.success("Member added successfully");
      setNewEmail("");
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsAdding(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Shield className="text-purple-600" size={20} />;
      case "admin":
        return <Shield className="text-indigo-600" size={20} />;
      case "user":
        return <User className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-indigo-50 bg-white/70 p-10 shadow-xl shadow-indigo-100/20 backdrop-blur-xl">
      <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold text-gray-900">
        Participants
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
          {Object.keys(room.members).length}
        </span>
      </h2>

      {canManage && (
        <form onSubmit={handleAddMember} className="mb-10 flex flex-col gap-6">
          <div className="w-full">
            <Input
              id="new-member-email"
              label="Invite by Email"
              type="email"
              placeholder="user@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <label className="mb-3 block text-xl font-medium text-gray-700">
              Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-6 py-5 text-xl text-gray-900 transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isAdding || !newEmail.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-8 py-5 text-xl font-bold text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
          >
            <UserPlus size={24} />
            Invite
          </button>
        </form>
      )}

      <div className="space-y-4">
        {Object.entries(room.members).map(([email, role]) => (
          <div
            key={email}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-100 to-purple-100 text-xl font-bold text-indigo-700">
                {email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">{email}</p>
                <p className="text-gray-500 capitalize">{role}</p>
              </div>
            </div>
            <div
              className="rounded-full bg-gray-50 p-3"
              title={`Role: ${role}`}
            >
              {getRoleIcon(role)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
