"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getBookingsForRooms } from "@/features/bookings/bookingsService";
import { Booking } from "@/features/bookings/types";
import { getUserRooms } from "@/features/rooms/roomService";
import BookingCard from "@/features/bookings/components/BookingCard";
import CreateBookingModal from "@/features/bookings/components/CreateBookingModal";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allRooms, setAllRooms] = useState<{ id: string; name: string; role: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (showLoading = false) => {
    if (!user?.email) return;
    if (showLoading) setIsLoading(true);
    try {
      // 1. Fetch all rooms the user has access to
      const roomsList = await getUserRooms(user.email);
      const mappedRooms = roomsList.map(r => ({
        id: r.id as string,
        name: r.name,
        role: r.members[user!.email!]
      }));
      setAllRooms(mappedRooms);

      // 2. Fetch bookings for all these rooms
      const roomIds = mappedRooms.map(r => r.id);
      if (roomIds.length > 0) {
        const bookingsList = await getBookingsForRooms(roomIds);
        // Sort bookings by date and time
        bookingsList.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`);
          const dateB = new Date(`${b.date}T${b.startTime}`);
          return dateA.getTime() - dateB.getTime();
        });
        setBookings(bookingsList);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookings data:", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchData(true);
      const intervalId = setInterval(() => fetchData(false), 5000);
      return () => clearInterval(intervalId);
    }
  }, [authLoading, fetchData]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/30">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">Завантаження...</div>
      </div>
    );
  }

  // User can only create bookings for rooms they own or admin
  const creatableRooms = allRooms.filter(r => r.role === "owner" || r.role === "admin");

  // Split bookings into two lists
  const joinedBookings = bookings.filter(b => b.attendees?.includes(user?.email || ""));
  const invitationBookings = bookings.filter(b => !b.attendees?.includes(user?.email || "") && !b.declinedBy?.includes(user?.email || ""));

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      <PageHeader 
        title="Bookings"
        description="View and manage events in your rooms"
        actionButton={
          creatableRooms.length > 0 ? (
            <button 
              className="flex items-center gap-3 bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5" 
              onClick={() => setIsModalOpen(true)}
            >
              + New Booking
            </button>
          ) : undefined
        }
      />

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl font-bold text-gray-400 mb-4">No bookings yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {joinedBookings.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Joined Events</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {joinedBookings.map((b) => {
                  const room = allRooms.find(r => r.id === b.roomId);
                  const userRole = room?.role || 'user';
                  const roomName = room?.name || 'Unknown Room';
                  return (
                    <BookingCard 
                      key={b.id} 
                      booking={b} 
                      currentUserEmail={user?.email || ""}
                      userRole={userRole}
                      roomName={roomName}
                      onBookingUpdated={fetchData}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {invitationBookings.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Invitations</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {invitationBookings.map((b) => {
                  const room = allRooms.find(r => r.id === b.roomId);
                  const userRole = room?.role || 'user';
                  const roomName = room?.name || 'Unknown Room';
                  return (
                    <BookingCard 
                      key={b.id} 
                      booking={b} 
                      currentUserEmail={user?.email || ""}
                      userRole={userRole}
                      roomName={roomName}
                      onBookingUpdated={fetchData}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      <CreateBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rooms={creatableRooms}
        userEmail={user?.email || ""}
        onBookingCreated={fetchData}
      />
    </main>
  );
}
