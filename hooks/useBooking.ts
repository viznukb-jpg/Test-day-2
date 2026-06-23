import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Booking } from "@/features/bookings/types";

const BOOKINGS_COLLECTION = "bookings";

export const useBooking = (bookingId: string) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setBooking(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setBooking({ id: snapshot.id, ...snapshot.data() } as Booking);
        } else {
          setBooking(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching booking:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [bookingId]);

  return { booking, loading, error };
};
