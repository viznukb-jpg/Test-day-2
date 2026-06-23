import React from "react";

interface DeclinedListProps {
  declinedEmails: string[];
  canManage: boolean;
  onReinvite: (userEmail: string) => void;
}

export default function DeclinedList({ declinedEmails, canManage, onReinvite }: DeclinedListProps) {
  if (declinedEmails.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
        Declined <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xl">{declinedEmails.length}</span>
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {declinedEmails.map((declinedEmail) => (
          <div key={declinedEmail} className="flex items-center justify-between bg-red-50/50 rounded-2xl p-6 border border-red-100">
            <span className="text-lg font-medium text-gray-800 truncate max-w-[60%]">{declinedEmail}</span>
            {canManage && (
              <button 
                onClick={() => onReinvite(declinedEmail)}
                className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Re-invite
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
