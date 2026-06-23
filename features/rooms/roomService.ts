import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, FieldPath, doc, deleteDoc } from "firebase/firestore";
import { Room } from "./types";

const ROOMS_COLLECTION = "rooms";

export const createRoom = async (
  name: string,
  description: string,
  userEmail: string,
) => {
  const newRoom: Room = {
    name,
    description,
    ownerEmail: userEmail,
    members: {
      [userEmail]: "owner",
    },
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, ROOMS_COLLECTION), newRoom);
  return { id: docRef.id, ...newRoom };
};

export const getUserRooms = async (userEmail: string) => {
  const q = query(
    collection(db, ROOMS_COLLECTION),
    where(new FieldPath("members", userEmail), "in", ["owner", "admin", "user"]),
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Room[];
};

export const deleteRoom = async (roomId: string) => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await deleteDoc(roomRef);
};
