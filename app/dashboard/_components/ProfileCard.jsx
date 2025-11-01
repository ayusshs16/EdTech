"use client";
import React from "react";

function getInitials(name) {
  if (!name) return "G";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProfileCard({ user, isLoaded }) {
  const displayName = user?.fullName || user?.firstName || "Guest";
  const email = user?.primaryEmailAddress?.emailAddress || "-";
  const initials = getInitials(displayName);

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-blue-700">
          {initials}
        </div>
        <div>
          <div className="text-lg font-semibold">{displayName}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600">Member since</div>
        <div className="text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-md">Edit Profile</button>
        <button className="py-2 px-3 border rounded-md">Settings</button>
      </div>
    </div>
  );
}
