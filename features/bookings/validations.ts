import { z } from "zod";

export const bookingSchema = z
  .object({
    roomId: z.string().min(1, "Please select a room"),
    title: z
      .string()
      .min(1, "Event title is required")
      .max(100, "Title is too long"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      return data.endTime > data.startTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"], // the error will be attached to endTime
    },
  );

export type BookingFormValues = z.infer<typeof bookingSchema>;
