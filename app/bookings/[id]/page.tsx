"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { getBookingById, deleteBooking, reinviteUser } from "@/features/bookings/bookingsService";
import { getRoomById } from "@/features/rooms/roomService";
import { Booking } from "@/features/bookings/types";
import { Room } from "@/features/rooms/types";
import { PageHeader } from "@/components/ui/PageHeader";
import EditBookingModal from "@/features/bookings/components/EditBookingModal";
import toast from "react-hot-toast";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async (showLoading = false) => {
    if (!id || !user?.email) return;
    if (showLoading) setIsLoading(true);
    try {
      const b = await getBookingById(id as string);
      if (b) {
        setBooking(b);
        const r = await getRoomById(b.roomId);
        setRoom(r);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load booking details");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (!authLoading) {
      fetchData(true);
      const intervalId = setInterval(() => fetchData(false), 5000);
      return () => clearInterval(intervalId);
    }
  }, [authLoading, fetchData]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/30">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">Завантаження...</div>
      </div>
    );
  }

  if (!booking || !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/30">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
        <button onClick={() => router.push("/bookings")} className="text-indigo-600 hover:underline text-lg">
          Go back to bookings
        </button>
      </div>
    );
  }

  const userRole = room.members[user?.email || ""] || "user";
  const isCreator = booking.bookedBy === user?.email;
  const canManage = isCreator || userRole === "owner" || userRole === "admin";

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
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to re-invite user");
    }
  };

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      <button 
        onClick={() => router.push("/bookings")}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors text-lg font-medium"
      >
        <ArrowLeft size={20} /> Back to Bookings
      </button>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10 md:p-16 relative">
        {canManage && (
          <div className="absolute top-10 right-10 flex gap-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-indigo-100 transition-colors"
            >
              <Pencil size={20} /> EDIT
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} /> {isDeleting ? "WAIT..." : "DELETE"}
            </button>
          </div>
        )}

        <div className="mb-4 flex gap-3 text-lg font-bold uppercase tracking-widest text-indigo-500">
          <span>{room.name}</span>
          <span>•</span>
          <span>{booking.date}</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          {booking.title}
        </h1>

        <div className="flex items-center gap-4 text-2xl font-medium text-gray-600 mb-10">
          <div className="bg-gray-100 px-6 py-2 rounded-2xl">
            {booking.startTime} - {booking.endTime}
          </div>
          <div className="text-gray-400">
            Organized by: <span className="text-gray-700">{booking.bookedBy}</span>
          </div>
        </div>

        {booking.description && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
            <p className="text-xl leading-relaxed text-gray-600 whitespace-pre-wrap">
              {booking.description}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
            Attendees <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xl">{booking.attendees?.length || 0}</span>
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {booking.attendees?.map((attendeeEmail) => {
              const role = room.members[attendeeEmail] || "participant";
              return (
                <div key={attendeeEmail} className="flex items-center justify-between bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <span className="text-lg font-medium text-gray-800 truncate max-w-[70%]">{attendeeEmail}</span>
                  <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    role === "owner" ? "bg-purple-100 text-purple-700" :
                    role === "admin" ? "bg-indigo-100 text-indigo-700" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {booking.declinedBy && booking.declinedBy.length > 0 && (
          <div className="mt-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
              Declined <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xl">{booking.declinedBy.length}</span>
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {booking.declinedBy.map((declinedEmail) => (
                <div key={declinedEmail} className="flex items-center justify-between bg-red-50/50 rounded-2xl p-6 border border-red-100">
                  <span className="text-lg font-medium text-gray-800 truncate max-w-[60%]">{declinedEmail}</span>
                  {canManage && (
                    <button 
                      onClick={() => handleReinvite(declinedEmail)}
                      className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Re-invite
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {canManage && (
        <EditBookingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          rooms={[{ id: room.id as string, name: room.name }]} // Only pass the current room
          booking={booking}
          onBookingUpdated={fetchData}
        />
      )}
    </main>
  );
}
