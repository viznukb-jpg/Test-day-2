"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import {
  deleteBooking,
  reinviteUser,
} from "@/features/bookings/bookingsService";
import { useRoom } from "@/hooks/useRoom";
import { useBooking } from "@/hooks/useBooking";
import EditBookingModal from "@/features/bookings/components/EditBookingModal";
import AttendeesList from "@/features/bookings/components/AttendeesList";
import DeclinedList from "@/features/bookings/components/DeclinedList";
import { BackLink } from "@/components/ui/BackLink";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const { booking, loading: isLoadingBooking } = useBooking(id as string);
  const { room, loading: isLoadingRoom } = useRoom(booking?.roomId || "");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (authLoading || isLoadingBooking || isLoadingRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/30">
        <div className="animate-pulse text-xl font-bold text-indigo-600">
          Loading...
        </div>
      </div>
    );
  }

  if (!booking || !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/30">
        <h2 className="mb-4 text-3xl font-bold text-gray-800">
          Booking Not Found
        </h2>
        <button
          onClick={() => router.push("/bookings")}
          className="text-lg text-indigo-600 hover:underline"
        >
          Go back to bookings
        </button>
      </div>
    );
  }

  const userRole = room.members[user?.email || ""];
  if (!userRole) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/30">
        <h2 className="mb-4 text-3xl font-bold text-red-600">Access Denied</h2>
        <p className="mb-6 text-xl text-gray-600">
          You do not have permission to view this booking.
        </p>
        <button
          onClick={() => router.push("/bookings")}
          className="text-lg font-bold text-indigo-600 hover:underline"
        >
          &larr; Go back to bookings
        </button>
      </div>
    );
  }

  const userRoleStr = userRole || "user";
  const isCreator = booking.bookedBy === user?.email;
  const canManage =
    isCreator || userRoleStr === "owner" || userRoleStr === "admin";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setIsDeleting(true);
    try {
      await deleteBooking(booking.id);
      toast.success("Booking deleted");
      router.push("/bookings");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
      setIsDeleting(false);
    }
  };

  const handleReinvite = async (userEmail: string) => {
    try {
      await reinviteUser(booking.id, userEmail);
      toast.success(`${userEmail} has been re-invited`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to re-invite user");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <BackLink href="/bookings" label="Back to Bookings" />

      <div className="relative rounded-[3rem] border border-gray-100 bg-white p-10 shadow-sm md:p-16">
        {canManage && (
          <div className="absolute top-10 right-10 flex gap-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-indigo-50 px-6 py-3 font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
            >
              <Pencil size={20} /> EDIT
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-full bg-red-50 px-6 py-3 font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 size={20} /> {isDeleting ? "WAIT..." : "DELETE"}
            </button>
          </div>
        )}

        <div className="mb-4 flex gap-3 text-lg font-bold tracking-widest text-indigo-500 uppercase">
          <span>{room.name}</span>
          <span>•</span>
          <span>{booking.date}</span>
        </div>

        <h1 className="mb-6 text-5xl font-extrabold text-gray-900 md:text-6xl">
          {booking.title}
        </h1>

        <div className="mb-10 flex items-center gap-4 text-2xl font-medium text-gray-600">
          <div className="rounded-2xl bg-gray-100 px-6 py-2">
            {booking.startTime} - {booking.endTime}
          </div>
          <div className="text-gray-400">
            Organized by:{" "}
            <span className="text-gray-700">{booking.bookedBy}</span>
          </div>
        </div>

        {booking.description && (
          <div className="mb-16">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Description
            </h3>
            <p className="text-xl leading-relaxed whitespace-pre-wrap text-gray-600">
              {booking.description}
            </p>
          </div>
        )}

        <AttendeesList
          attendees={booking.attendees || []}
          roomMembers={room.members}
        />

        <DeclinedList
          declinedEmails={booking.declinedBy || []}
          canManage={canManage}
          onReinvite={handleReinvite}
        />
      </div>

      {canManage && (
        <EditBookingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          rooms={[{ id: room.id as string, name: room.name }]} // Only pass the current room
          booking={booking}
        />
      )}
    </main>
  );
}
