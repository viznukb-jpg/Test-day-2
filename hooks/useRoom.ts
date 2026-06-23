import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Room } from "@/features/rooms/types";

const ROOMS_COLLECTION = "rooms";

export const useRoom = (roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(!!roomId);
  const [error, setError] = useState<Error | null>(null);
  const [prevRoomId, setPrevRoomId] = useState(roomId);

  if (roomId !== prevRoomId) {
    setPrevRoomId(roomId);
    setRoom(null);
    setLoading(!!roomId);
    setError(null);
  }

  useEffect(() => {
    let isMounted = true;
    if (!roomId) {
      return () => { isMounted = false; };
    }
    const docRef = doc(db, ROOMS_COLLECTION, roomId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!isMounted) return;
        if (snapshot.exists()) {
          setRoom({ id: snapshot.id, ...snapshot.data() } as Room);
        } else {
          setRoom(null);
        }
        setLoading(false);
      },
      (err) => {
        if (isMounted) {
          console.error("Error fetching room:", err);
          setError(err);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [roomId]);

  return { room, loading, error };
};
