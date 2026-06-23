import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/features/bookings/types";

export async function getBookingById(
  bookingId: string,
): Promise<Booking | null> {
  const bookingRef = doc(db, "bookings", bookingId);
  const snap = await getDoc(bookingRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Booking;
}

export async function getBookingsForRooms(
  roomIds: string[],
): Promise<Booking[]> {
  if (!roomIds.length) return [];

  const chunks = [];
  for (let i = 0; i < roomIds.length; i += 10) {
    chunks.push(roomIds.slice(i, i + 10));
  }

  let allBookings: Booking[] = [];
  for (const chunk of chunks) {
    const q = query(collection(db, "bookings"), where("roomId", "in", chunk));
    const snapshot = await getDocs(q);
    const chunkBookings = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
      } as Booking;
    });
    allBookings = [...allBookings, ...chunkBookings];
  }

  return allBookings;
}

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt">,
): Promise<Booking> {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return { id: docRef.id, ...data, createdAt: new Date() };
}

export async function joinBooking(
  bookingId: string,
  userEmail: string,
): Promise<void> {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    attendees: arrayUnion(userEmail),
  });
}

export async function leaveBooking(
  bookingId: string,
  userEmail: string,
): Promise<void> {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    attendees: arrayRemove(userEmail),
    declinedBy: arrayUnion(userEmail),
  });
}

export async function reinviteUser(
  bookingId: string,
  userEmail: string,
): Promise<void> {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    declinedBy: arrayRemove(userEmail),
  });
}

export async function isRoomAvailable(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string,
): Promise<{ available: boolean; conflictTime?: string }> {
  const q = query(
    collection(db, "bookings"),
    where("roomId", "==", roomId),
    where("date", "==", date),
  );

  const snapshot = await getDocs(q);
  const existingBookings = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Booking)
    .filter((booking) => booking.id !== excludeBookingId);

  for (const booking of existingBookings) {
    if (startTime < booking.endTime && endTime > booking.startTime) {
      return {
        available: false,
        conflictTime: `${booking.startTime} - ${booking.endTime}`,
      };
    }
  }

  return { available: true };
}

export async function deleteBooking(bookingId: string): Promise<void> {
  const bookingRef = doc(db, "bookings", bookingId);
  await deleteDoc(bookingRef);
}

export async function updateBooking(
  bookingId: string,
  updatedData: Partial<Booking>,
): Promise<void> {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, updatedData);
}
