"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import BookingCard from "@/features/bookings/components/BookingCard";
import CreateBookingModal from "@/features/bookings/components/CreateBookingModal";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { rooms: allRooms, loading: isLoadingRooms } = useRooms(user?.email);
  const roomIds = allRooms.map((r) => r.id as string);
  const { bookings, loading: isLoadingBookings } = useBookings(roomIds);

  const isLoading = isLoadingRooms || isLoadingBookings;

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/30">
        <div className="animate-pulse text-xl font-bold text-indigo-600">
          Loading...
        </div>
      </div>
    );
  }

  // User can only create bookings for rooms they own or admin
  const creatableRooms = allRooms.filter(
    (r) =>
      r.members[user?.email || ""] === "owner" ||
      r.members[user?.email || ""] === "admin",
  );

  // Split bookings into two lists
  const joinedBookings = bookings.filter((b) =>
    b.attendees?.includes(user?.email || ""),
  );
  const invitationBookings = bookings.filter(
    (b) =>
      !b.attendees?.includes(user?.email || "") &&
      !b.declinedBy?.includes(user?.email || ""),
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <PageHeader
        title="Bookings"
        description="View and manage events in your rooms"
        actionButton={
          creatableRooms.length > 0 ? (
            <button
              className="flex items-center gap-3 rounded-full bg-gray-900 px-8 py-4 text-xl font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20"
              onClick={() => setIsModalOpen(true)}
            >
              + New Booking
            </button>
          ) : undefined
        }
      />

      {bookings.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-4xl font-bold text-gray-400">
            No bookings yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {joinedBookings.length > 0 && (
            <section>
              <h2 className="mb-8 text-3xl font-bold text-gray-800">
                Joined Events
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {joinedBookings.map((b) => {
                  const room = allRooms.find((r) => r.id === b.roomId);
                  const userRole = user?.email
                    ? room?.members[user.email] || "user"
                    : "user";
                  const roomName = room?.name || "Unknown Room";
                  return (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      currentUserEmail={user?.email || ""}
                      userRole={userRole}
                      roomName={roomName}
                      onBookingUpdated={() => {}}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {invitationBookings.length > 0 && (
            <section>
              <h2 className="mb-8 text-3xl font-bold text-gray-800">
                Invitations
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {invitationBookings.map((b) => {
                  const room = allRooms.find((r) => r.id === b.roomId);
                  const userRole = user?.email
                    ? room?.members[user.email] || "user"
                    : "user";
                  const roomName = room?.name || "Unknown Room";
                  return (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      currentUserEmail={user?.email || ""}
                      userRole={userRole}
                      roomName={roomName}
                      onBookingUpdated={() => {}}
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
        rooms={creatableRooms.map(r => ({ id: r.id as string, name: r.name }))}
        userEmail={user?.email || ""}
        onBookingCreated={() => {}}
      />
    </main>
  );
}
