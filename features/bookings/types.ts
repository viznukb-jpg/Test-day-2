// Booking type definition
export interface Booking {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  bookedBy: string; // userEmail
  attendees: string[]; // array of userEmails
  declinedBy?: string[]; // array of userEmails
  createdAt: Date;
}
