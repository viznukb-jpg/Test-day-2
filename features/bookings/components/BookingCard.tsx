"use client";

import { useState } from "react";
import { Booking } from "@/features/bookings/types";
import {
  joinBooking,
  leaveBooking,
  deleteBooking,
} from "@/features/bookings/bookingsService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  booking: Booking;
  currentUserEmail: string;
  userRole: string;
  roomName: string;
}

export default function BookingCard({
  booking,
  currentUserEmail,
  userRole,
  roomName,
}: BookingCardProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const isAttendee = booking.attendees?.includes(currentUserEmail);
  const isCreator = booking.bookedBy === currentUserEmail;
  const canManage = isCreator || userRole === "owner" || userRole === "admin";

  const handleToggleJoin = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsUpdating(true);
    try {
      if (isAttendee) {
        await leaveBooking(booking.id, currentUserEmail);
        toast.success("You left the meeting");
      } else {
        await joinBooking(booking.id, currentUserEmail);
        toast.success("You joined the meeting");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setIsUpdating(true);
    try {
      await deleteBooking(booking.id);
      toast.success("Booking deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
      setIsUpdating(false);
    }
  };

  return (
    <div
      onClick={() => router.push(`/bookings/${booking.id}`)}
      className="group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-[3rem] border border-indigo-50 bg-white p-10 text-center shadow-xl shadow-indigo-100/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/20"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      <div className="mt-4 flex w-full flex-col items-center">
        <div className="mb-3 flex gap-2 text-sm font-bold tracking-widest text-gray-400 uppercase">
          <span>{roomName}</span>
          <span>•</span>
          <span>Role: {userRole}</span>
        </div>
        <h3 className="relative z-10 mb-3 text-4xl font-extrabold text-gray-900 transition-colors group-hover:text-indigo-600">
          {booking.title}
        </h3>

        <div className="mb-5 flex w-full flex-col gap-2 rounded-3xl bg-indigo-50/50 px-8 py-3 text-xl font-medium text-indigo-500">
          <span>{booking.date}</span>
          <span>
            {booking.startTime} - {booking.endTime}
          </span>
        </div>

        {booking.description && (
          <p className="mb-8 line-clamp-3 text-2xl leading-relaxed text-gray-500">
            {booking.description}
          </p>
        )}
      </div>

      <div className="relative z-10 mt-auto flex w-full flex-col items-center gap-4 border-t border-gray-100 pt-6">
        <div className="mb-2 flex w-full flex-col items-center gap-2 px-2 text-lg font-medium text-gray-500">
          <span>Attendees: {booking.attendees?.length || 0}</span>
          <span className="max-w-full truncate" title={booking.bookedBy}>
            Org: {booking.bookedBy}
          </span>
        </div>

        {(() => {
          let btnText = isAttendee ? "LEAVE" : "JOIN";
          let btnAction = handleToggleJoin;
          let btnClasses = isAttendee
            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
            : "bg-indigo-600 text-white shadow-md hover:bg-indigo-700";

          if (canManage && isAttendee) {
            btnText = "DELETE BOOKING";
            btnAction = handleDelete;
            btnClasses = "bg-red-50 text-red-600 hover:bg-red-100";
          }

          return (
            <button
              onClick={btnAction}
              disabled={isUpdating}
              className={`w-full rounded-full px-8 py-4 text-xl font-bold tracking-widest transition-all ${btnClasses} uppercase disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isUpdating ? "WAIT..." : btnText}
            </button>
          );
        })()}
      </div>
    </div>
  );
}
