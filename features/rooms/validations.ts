import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  description: z.string().optional(),
});

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>;
