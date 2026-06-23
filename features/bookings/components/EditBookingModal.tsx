"use client";

import { useState } from "react";
import { updateBooking, isRoomAvailable } from "@/features/bookings/bookingsService";
import toast from "react-hot-toast";
import { Booking } from "@/features/bookings/types";
import BookingForm from "./BookingForm";
import { BookingFormValues } from "../validations";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: { id: string; name: string }[];
  booking: Booking;
}

export default function EditBookingModal({
  isOpen,
  onClose,
  rooms,
  booking,
}: EditBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const { available, conflictTime } = await isRoomAvailable(
        data.roomId, 
        data.date, 
        data.startTime, 
        data.endTime, 
        booking.id
      );
      if (!available) {
        toast.error(`Room is occupied during this time (${conflictTime})`);
        setIsSubmitting(false);
        return;
      }

      await updateBooking(booking.id, {
        roomId: data.roomId,
        title: data.title,
        description: data.description,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      toast.success("Booking successfully updated");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
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
          Edit Booking
        </h2>

        <BookingForm
          defaultValues={{
            roomId: booking.roomId,
            title: booking.title,
            description: booking.description,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
          }}
          rooms={rooms}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitText="Update Event"
        />
      </div>
    </div>
  );
}
