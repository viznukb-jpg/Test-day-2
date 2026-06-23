import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Booking } from "@/features/bookings/types";

const BOOKINGS_COLLECTION = "bookings";

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const useBookings = (roomIds: string[]) => {
  const roomIdsString = roomIds ? roomIds.join(",") : "";
  const hasRoomIds = roomIds && roomIds.length > 0;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(hasRoomIds);
  const [error, setError] = useState<Error | null>(null);
  const [prevRoomIdsStr, setPrevRoomIdsStr] = useState(roomIdsString);

  if (roomIdsString !== prevRoomIdsStr) {
    setPrevRoomIdsStr(roomIdsString);
    setBookings([]);
    setLoading(hasRoomIds);
    setError(null);
  }

  useEffect(() => {
    let isMounted = true;
    if (!hasRoomIds) {
      return () => {
        isMounted = false;
      };
    }
    const chunks = chunkArray(roomIds, 10);
    const unsubscribes: (() => void)[] = [];
    const currentBookingsMap = new Map<string, Booking>();
    let loadedChunks = 0;

    chunks.forEach((chunk) => {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where("roomId", "in", chunk),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
              currentBookingsMap.delete(change.doc.id);
            } else {
              currentBookingsMap.set(change.doc.id, {
                id: change.doc.id,
                ...change.doc.data(),
              } as Booking);
            }
          });

          loadedChunks++;
          if (loadedChunks >= chunks.length && isMounted) {
            const allBookings = Array.from(currentBookingsMap.values());
            allBookings.sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.startTime}`);
              const dateB = new Date(`${b.date}T${b.startTime}`);
              return dateA.getTime() - dateB.getTime();
            });
            setBookings(allBookings);
            setLoading(false);
          }
        },
        (err) => {
          if (isMounted) {
            console.error("Error fetching bookings:", err);
            setError(err);
            setLoading(false);
          }
        },
      );
      unsubscribes.push(unsubscribe);
    });

    return () => {
      isMounted = false;
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [hasRoomIds, roomIdsString]);

  return { bookings, loading, error };
};
