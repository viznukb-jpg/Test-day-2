export interface Booking {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  attendees: string[];
  declinedBy?: string[];
  createdAt: Date;
}
