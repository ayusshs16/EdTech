"use client";
import React from "react";
import { Fire } from "lucide-react";

export default function Streaks({ streak }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-md">
            <Fire className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Current Streak</div>
            <div className="text-2xl font-semibold">{streak.currentStreak}d</div>
          </div>
        </div>
        <div className="text-sm text-gray-500 text-right">
          <div>Best: {streak.bestStreak}d</div>
          <div className="mt-1">Last active: {streak.lastActive}</div>
        </div>
      </div>
    </div>
  );
}
