import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  FieldPath,
  onSnapshot,
} from "firebase/firestore";
import { Room } from "@/features/rooms/types";

const ROOMS_COLLECTION = "rooms";

export const useRooms = (userEmail?: string | null) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(!!userEmail);
  const [error, setError] = useState<Error | null>(null);
  const [prevEmail, setPrevEmail] = useState(userEmail);

  if (userEmail !== prevEmail) {
    setPrevEmail(userEmail);
    setRooms([]);
    setLoading(!!userEmail);
    setError(null);
  }

  useEffect(() => {
    let isMounted = true;
    if (!userEmail) {
      return () => {
        isMounted = false;
      };
    }
    const q = query(
      collection(db, ROOMS_COLLECTION),
      where(new FieldPath("members", userEmail), "in", [
        "owner",
        "admin",
        "user",
      ]),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedRooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Room[];
        setRooms(fetchedRooms);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching rooms:", err);
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userEmail]);

  return { rooms, loading, error };
};
