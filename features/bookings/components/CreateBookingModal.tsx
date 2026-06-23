"use client";

import { useState } from "react";
import { createBooking, isRoomAvailable } from "@/features/bookings/bookingsService";
import toast from "react-hot-toast";
import BookingForm from "./BookingForm";
import { BookingFormValues } from "../validations";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: { id: string; name: string }[];
  userEmail: string;
  onBookingCreated: () => void;
}

export default function CreateBookingModal({
  isOpen,
  onClose,
  rooms,
  userEmail,
  onBookingCreated,
}: CreateBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const { available, conflictTime } = await isRoomAvailable(data.roomId, data.date, data.startTime, data.endTime);
      if (!available) {
        toast.error(`Room is occupied during this time (${conflictTime})`);
        setIsSubmitting(false);
        return;
      }

      await createBooking({
        roomId: data.roomId,
        title: data.title,
        description: data.description,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        bookedBy: userEmail,
        attendees: [userEmail],
      });
      toast.success("Booking successfully created");
      onBookingCreated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl bg-white/90 p-12 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-8 text-5xl font-extrabold text-gray-900">
          New Booking
        </h2>

        <BookingForm
          rooms={rooms}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitText="Create Event"
        />
      </div>
    </div>
  );
}
