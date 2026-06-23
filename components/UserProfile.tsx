interface UserProfileProps {
  displayName: string | null;
  email: string | null;
}

export default function UserProfile({ displayName, email }: UserProfileProps) {
  const displayNameFallback = displayName || email?.split("@")[0] || "User";

  return (
    <div className="flex flex-col items-end rounded-3xl border border-gray-200 bg-gray-50 px-8 py-3.5 shadow-sm">
      <span className="mb-0.5 text-2xl font-bold text-gray-900">
        Welcome, <span className="text-indigo-600">{displayNameFallback}</span>!
      </span>
      <span className="text-lg font-medium text-gray-500">{email}</span>
    </div>
  );
}
