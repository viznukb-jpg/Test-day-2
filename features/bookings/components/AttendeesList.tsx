import React from "react";

interface AttendeesListProps {
  attendees: string[];
  roomMembers: Record<string, string>;
}

export default function AttendeesList({ attendees, roomMembers }: AttendeesListProps) {
  return (
    <div>
      <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
        Attendees <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xl">{attendees.length}</span>
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {attendees.map((attendeeEmail) => {
          const role = roomMembers[attendeeEmail] || "participant";
          return (
            <div key={attendeeEmail} className="flex items-center justify-between bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <span className="text-lg font-medium text-gray-800 truncate max-w-[70%]">{attendeeEmail}</span>
              <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                role === "owner" ? "bg-purple-100 text-purple-700" :
                role === "admin" ? "bg-indigo-100 text-indigo-700" :
                "bg-gray-200 text-gray-600"
              }`}>
                {role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
