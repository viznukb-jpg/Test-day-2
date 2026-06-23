"use client";

import { useState } from "react";
import { updateBooking, isRoomAvailable } from "@/features/bookings/bookingsService";
import toast from "react-hot-toast";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { Booking } from "@/features/bookings/types";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: { id: string; name: string }[];
  booking: Booking;
  onBookingUpdated: () => void;
}

const TODAY = new Date();
const MAX_BOOKING_MONTHS = 3;
const MAX_DATE = new Date(TODAY.getFullYear(), TODAY.getMonth() + MAX_BOOKING_MONTHS, TODAY.getDate());

export default function EditBookingModal({
  isOpen,
  onClose,
  rooms,
  booking,
  onBookingUpdated,
}: EditBookingModalProps) {
  const [title, setTitle] = useState(booking.title);
  const [description, setDescription] = useState(booking.description || "");
  const [roomId, setRoomId] = useState(booking.roomId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(`${booking.date}T12:00:00`));
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = selectedDate ? selectedDate.toISOString().split("T")[0] : "";
    if (!roomId || !title || !formattedDate || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (endTime <= startTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);
    try {
      const { available, conflictTime } = await isRoomAvailable(roomId, formattedDate, startTime, endTime, booking.id);
      if (!available) {
        toast.error(`Room is occupied during this time (${conflictTime})`);
        setIsSubmitting(false);
        return;
      }

      await updateBooking(booking.id, {
        roomId,
        title,
        description,
        date: formattedDate,
        startTime,
        endTime,
      });
      toast.success("Booking successfully updated");
      onBookingUpdated();
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setRoomId("");
      setSelectedDate(undefined);
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content w-full max-w-4xl p-12 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-8 text-5xl font-extrabold text-gray-900">
          Edit Booking
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col gap-3 text-xl font-semibold text-gray-700">
            Room *
            <select
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-3 text-xl font-semibold text-gray-700">
            Event Title *
            <input
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Team Meeting"
              required
            />
          </label>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col gap-3 text-xl font-semibold text-gray-700 relative w-full md:w-1/2">
              Date *
              <button 
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full text-left rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
              </button>

              {isCalendarOpen && (
                <div 
                  className="absolute top-full mt-2 z-50 border border-gray-200 bg-white rounded-2xl p-4 shadow-2xl" 
                  style={{ transform: "scale(1.1)", transformOrigin: "top left" }}
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    hidden={{ before: TODAY, after: MAX_DATE }}
                    disabled={{ before: TODAY, after: MAX_DATE }}
                    startMonth={TODAY}
                    endMonth={MAX_DATE}
                    className="mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 flex-1">
              <label className="flex flex-col gap-3 text-xl font-semibold text-gray-700">
                Start *
                <input
                  type="time"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col gap-3 text-xl font-semibold text-gray-700">
                End *
                <input
                  type="time"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>

          <label className="flex flex-col gap-3 text-xl font-semibold text-gray-700">
            Description
            <textarea
              className="h-32 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the event..."
            />
          </label>

          <div className="mt-6 flex gap-6">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 rounded-2xl bg-gray-100 py-5 text-xl font-bold text-gray-600 transition-all hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 rounded-2xl bg-indigo-600 py-5 text-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
