"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormValues } from "../validations";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface BookingFormProps {
  defaultValues?: Partial<BookingFormValues>;
  rooms: { id: string; name: string }[];
  onSubmit: (data: BookingFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitText: string;
}

const TODAY = new Date();
const MAX_BOOKING_MONTHS = 3;
const MAX_DATE = new Date(TODAY.getFullYear(), TODAY.getMonth() + MAX_BOOKING_MONTHS, TODAY.getDate());

export default function BookingForm({
  defaultValues,
  rooms,
  onSubmit,
  onCancel,
  isSubmitting,
  submitText
}: BookingFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomId: defaultValues?.roomId || "",
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      date: defaultValues?.date || "",
      startTime: defaultValues?.startTime || "",
      endTime: defaultValues?.endTime || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <label className="flex flex-col gap-2 text-xl font-semibold text-gray-700">
        Room *
        <select
          {...register("roomId")}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select a room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {errors.roomId && <span className="text-sm text-red-500">{errors.roomId.message}</span>}
      </label>

      <label className="flex flex-col gap-2 text-xl font-semibold text-gray-700">
        Event Title *
        <input
          {...register("title")}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Team Meeting"
        />
        {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
      </label>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col gap-2 text-xl font-semibold text-gray-700 relative w-full md:w-1/2">
          Date *
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <>
                <button 
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full text-left rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                >
                  {field.value ? field.value : "Select a date"}
                </button>

                {isCalendarOpen && (
                  <div 
                    className="absolute top-full mt-2 z-50 border border-gray-200 bg-white rounded-2xl p-4 shadow-2xl" 
                    style={{ transform: "scale(1.1)", transformOrigin: "top left" }}
                  >
                    <DayPicker
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          // Format YYYY-MM-DD manually to avoid timezone issues
                          const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
                          field.onChange(formattedDate);
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
              </>
            )}
          />
          {errors.date && <span className="text-sm text-red-500">{errors.date.message}</span>}
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <label className="flex flex-col gap-2 text-xl font-semibold text-gray-700">
            Start *
            <input
              type="time"
              {...register("startTime")}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.startTime && <span className="text-sm text-red-500">{errors.startTime.message}</span>}
          </label>

          <label className="flex flex-col gap-2 text-xl font-semibold text-gray-700">
            End *
            <input
              type="time"
              {...register("endTime")}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.endTime && <span className="text-sm text-red-500">{errors.endTime.message}</span>}
          </label>
        </div>
      </div>

      <label className="flex flex-col gap-2 text-xl font-semibold text-gray-700">
        Description
        <textarea
          {...register("description")}
          className="h-32 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xl font-normal transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          placeholder="Brief description of the event..."
        />
        {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
      </label>

      <div className="mt-6 flex gap-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/3 rounded-2xl bg-gray-100 py-5 text-xl font-bold text-gray-600 transition-all hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-2/3 rounded-2xl bg-indigo-600 py-5 text-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
