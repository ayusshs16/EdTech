"use client";

import React from "react";
import GenZAnimation from "@/components/ui/genz-animation";
import { Button } from "@/components/ui/button";

const TopicDetail = ({ topic, detail, onClose, onUse }) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-2xl w-full">
        <GenZAnimation className="p-6">
          <div className="text-left text-neutral-900">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold">{topic}</h3>
              <button
                className="text-gray-600 text-xl"
                onClick={onClose}
                aria-label="Close topic detail"
              >
                ×
              </button>
            </div>

            {detail ? (
              <div className="mt-4 space-y-3">
                <p className="text-gray-700">{detail.summary}</p>
                <div>
                  <h4 className="font-semibold mt-2">Key points</h4>
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                    {detail.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <small className="text-xs text-gray-500">Est. duration: {detail.estimatedDuration}</small>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                    <Button onClick={() => onUse && onUse(topic)}>Use Topic</Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-gray-600">Generating details…</p>
            )}
          </div>
        </GenZAnimation>
      </div>
    </div>
  );
};

export default TopicDetail;
