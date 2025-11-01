"use client";
import React from "react";

function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
      <div className="h-4 bg-gradient-to-r from-teal-400 to-blue-600" style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function ProgressCard({ progress }) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Overall Progress</div>
          <div className="text-2xl font-semibold">{progress.overallPercent}%</div>
        </div>
        <div className="w-1/2">
          <ProgressBar percent={progress.overallPercent} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">Courses Completed</div>
          <div className="text-lg font-semibold">{progress.coursesCompleted}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-lg font-semibold">{progress.coursesInProgress}</div>
        </div>
      </div>
    </div>
  );
}
