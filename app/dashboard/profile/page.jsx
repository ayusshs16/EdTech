"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import ProfileCard from "../_components/ProfileCard";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileCard user={user} isLoaded={isLoaded} />
        </div>
      </div>
    </div>
  );
}
